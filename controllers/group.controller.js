const User = require("../models/userModel");
const { asyncHandler, ApiResponse, ApiError } = require("../utils/api.utils");

const createGroup = asyncHandler(async (req, res) => {
    const {userId} = req.data;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json(new ApiError(404,"User not found ! invalid token", "missing token !"))
    }
});