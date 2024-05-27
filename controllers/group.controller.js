const nodemon = require("nodemon");
const Group = require("../models/group.model");
const User = require("../models/userModel");
const {
    asyncHandler,
    ApiResponse,
    ApiError
} = require("../utils/api.utils");

//user actions
const joinGroup = asyncHandler(async (req, res) => {
    const {
        userId
    } = req.data;
    const {
        groupId
    } = req.body;
    const [user, group] = await Promise.all([User.findById(userId), Group.findById(groupId)])
    if (!user || !group) {
        return res.status(404).json(new ApiError(404, "Inavlid attempt ! invalid user or group", "missing or invalid token or groupId !"))
    };
    user.groups.push({
        groupId,
        joinedAt: Date.now()
    });
    await user.save();

    return res.json(new ApiResponse(200, "Joined to group successfully !", {
        group
    }));
});


//group - admin actions --
const createGroup = asyncHandler(async (req, res) => {
    const {
        userId
    } = req.data;
    const {
        name,
        _id,
        members,
        type
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiError(404, "Inavlid attempt you are not found ! invalid token", "missing or invalid token !"))
    };
    const isGroup = await Group.findById(_id);
    if (isGroup) {
        return res.status(401).json(new ApiError(401, "Group-Id have already been taken."))
    }
    const isPaid = user.pay(400);
    const group = await Group.create({
        name,
        type,
        admin: userId
    });

    return res.json(new ApiResponse(200, "Group created successfully !", {
        group
    }));
});
const updateGroup = asyncHandler(async (req,res) => {
    const {userId} = req.data;
    const {groupId, updatedData} = req.body;

    const user = await User.findById(userId);
    if(!user || !user.isGroupAdmin(groupId)){
        return  res.status(400).json(new ApiError(400, "Invalid attempt ! you are not an admin"))
    }

    const group = await Group.findByIdAndUpdate(groupId, updatedData, { new: true });

    return res.json(new ApiResponse(201, "Group updated successfully !", {group}))
});
const approveUser = asyncHandler(async (req,res)=>{
    const {
        userId
    } = req.data;
    const {
        groupId,
        approvingUserId
    } = req.body;
    const {user,group} = await Promise.all([User.findById(userId), Group.findById(groupId)]);

    if (!user || !user.isGroupAdmin(groupId) || !user.isAdmin) {
        return res.status(400).json(new ApiError(400, "Invalid attempt ! you don't have right to do this"));
    };

    group.approvedUsers.push({userId:approvingUserId, approvedAt:Date.now()});
    await group.save();
    return res.status(202).json(202, "User approved successfully !")
});

//group admin and admin both can do this --
const deleteGroup = asyncHandler(async (req, res) => {
    const {
        userId
    } = req.data;
    const {
        groupId
    } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.isGroupAdmin(groupId) || !user.isAdmin) {
        return res.status(400).json(new ApiError(400, "Invalid attempt ! you don't have right to do this"));
    }

    const group = await Group.findByIdAndDelete(groupId);

    return res.json(new ApiResponse(200, "Group deleted successfully !", {group}))
});

const groupController = {
    joinGroup,createGroup,updateGroup,approveUser,deleteGroup
};

module.exports = groupController;

