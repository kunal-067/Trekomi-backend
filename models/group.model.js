const {
    Schema,
    model
} = require("mongoose");

const groupSchema = new Schema({
    _id: {
        type: String,
        index: "text",
        required: true
    },
    name: {
        type: String,
        index: "text",
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    type: {
        type: String,
        enum: ["Private", "Public"],
        default: "Public"
    },
    approvedUsers: [{userId:{type:Schema.Types.ObjectId, ref:"User", required:true}, approvedAt:Date}],
    joiningFee:{
        type:Number,
        default:0
    },

    isApproved:{
        type:Boolean,
        default:true
    }
}, {
    timeStamps: true
})

const Group = model("Group", groupSchema);
module.exports = Group;