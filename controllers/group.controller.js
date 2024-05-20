const User = require("../models/userModel");
const { asyncHandler, ApiResponse, ApiError } = require("../utils/api.utils");

exports.joinGroup = asyncHandler(async (req,res) => { 
    const {userId} = req.data;
    const {groupId} = req.body;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json(
            new ApiError(404, "Invalid credentials ! try again.", "user not found")
        )
    }

})