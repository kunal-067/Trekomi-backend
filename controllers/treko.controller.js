const Group = require("../models/group.model");
const Treko = require("../models/treko.model");
const User = require("../models/userModel");
const { asyncHandler, ApiError, ApiResponse } = require("../utils/api.utils");

const getTrekos = asyncHandler(async (req, res)=>{
    const {userId, role} = req.data;
    const {size, page, _id} = req.query;
    let trekos;
    if((_id && _id == userId) || role == "Admin"){
        trekos = await Treko.find({uploadedBy: _id})
    }
    trekos  = await Treko.aggregate([{$sample:{size: size || 20}}, {$skip: (page || 0)*(size || 20)}])

    return res.json(new ApiResponse(200, "Trekos fetched successfullly !", trekos))
});

const getGroupsTrekos = asyncHandler(async (req,res)=>{
    const _id = req.params.Id;
    const {size, page} = req.query;
    const trekos = await Treko.find({uploadedIn: _id}).skip((size || 20)*(page || 0)).limit(size || 20)
})

const createTreko = asyncHandler(async (req, res) => {
    const {userId} = req.data;
    const {groupId} = req.body;
    const [user,group] = await Promise.all([User.findById(userId), Group.findById(groupId)])

    if(!user || !group){
        return res.status(404).json(new ApiError(404, "Invalid userId or groupId"));
    }

    const isApproved = group.approvedUsers.some(user => user.userId.equals(userId))
    if(isApproved && group.admin.equals(userId)){
        return res.status(400).json(new ApiError(400, "You are not allowed to create treko"));
    }

    const newTreko = await Treko.create({description, filePath, uploadedBy:userId, uploadedIn:groupId});

    return res.json(new ApiResponse(200, "Treko created successfully !", newTreko))

})

const trekoController = {
    createTreko,
}

module.exports = trekoController;