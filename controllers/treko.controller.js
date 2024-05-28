const cloudinary  = require("../config/cloudinary.config");
const Group = require("../models/group.model");
const Treko = require("../models/treko.model");
const User = require("../models/userModel");
const {
    asyncHandler,
    ApiError,
    ApiResponse
} = require("../utils/api.utils");

// Handler to get a list of Trekos (content items)
// Query parameters:
// - size: Number of trekos to fetch (optional, default is 20)
// - page: Page number for pagination (optional, default is 0)
// - _id: ID of the user whose trekos are being fetched (optional, used when role is Admin)
const getTrekos = asyncHandler(async (req, res) => {
    const { userId, role } = req.data;
    const { size, page, _id } = req.query;
    let trekos;

    if ((_id && _id == userId) || role == "Admin") {
        trekos = await Treko.find({ uploadedBy: _id });
    } else {
        trekos = await Treko.aggregate([
            { $sample: { size: size || 20 } }
        ]);
    }

    return res.json(new ApiResponse(200, "Trekos fetched successfully!", trekos));
});

// Handler to get trekos for a specific group
// URL parameter:
// - Id: ID of the group
// Query parameters:
// - user: ID of the user who uploaded the trekos (optional)
// - size: Number of trekos to fetch (optional, default is 20)
// - page: Page number for pagination (optional, default is 0)
const getGroupsTrekos = asyncHandler(async (req, res) => {
    const _id = req.params.Id;
    const queryUser = req.query.user;
    const { size, page } = req.query;

    let trekos = [];
    if (queryUser) {
        trekos = await Treko.find({
            uploadedIn: _id,
            uploadedBy: queryUser
        }).skip((size || 20) * (page || 0)).limit(size || 20);
    } else {
        trekos = await Treko.find({
            uploadedIn: _id
        }).skip((size || 20) * (page || 0)).limit(size || 20);
    }

    return res.json(new ApiResponse(200, "Trekos fetched successfully!", trekos));
});

// Handler to create a new treko
// Request body parameters:
// - groupId: ID of the group where the treko is being uploaded
// Request data (req.data):
// - userId: ID of the user uploading the treko
const createTreko = asyncHandler(async (req, res) => {
    const { userId } = req.data;
    const { groupId } = req.body;

    const [user, group] = await Promise.all([User.findById(userId), Group.findById(groupId)]);

    if (!user || !group) {
        return res.status(404).json(new ApiError(404, "Invalid userId or groupId"));
    }

    const isApproved = group.approvedUsers.some(user => user.userId.equals(userId));
    if (isApproved && group.admin.equals(userId)) {
        return res.status(400).json(new ApiError(400, "You are not allowed to create treko"));
    }
    const uploadRes = await cloudinary.uploader.upload(req.file);

    const newTreko = await Treko.create({
        description,
        filePath: uploadRes.secure_url,
        uploadedBy: userId,
        uploadedIn: groupId
    });

    return res.json(new ApiResponse(200, "Treko created successfully!", newTreko));
});

//Handler to remove treko
// Request body parameters:
// - groupId: ID of the group where the treko is being uploaded
// Request data (req.data):
// - userId: ID of the user uploading the treko
const removeTreko = asyncHandler(async (req,res)=>{
    const {userId} = req.data;
    const {trekoId} = req.body;
    const [user,treko] = await Promise.all([User.findById(userId), Treko.findById(trekoId).populate("uploadedIn")]);
    if(!user || !treko){
        return res.status(404).json(new ApiError(404, "Invalid userId or trekoId"))
    };
    if(!treko.uploadedBy.equals(userId) && !treko.uploadedIn.admin.equals(userId) && !user.isAdmin){
        return res.status(400).json(new ApiError(400, "You are not allowed to do this."))
    }

    await treko.deleteOne();

    return res.json(new ApiResponse(200, "Treko deleted successfully !"))
})


const trekoController = {
    getTrekos,getGroupsTrekos,createTreko,
}

module.exports = trekoController;