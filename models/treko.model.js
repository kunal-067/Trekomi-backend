const {
    Schema,
    model
} = require("mongoose");

const trekoSchema = new Schema({
    name: String,
    description: {
        type: String,
        required: true,
        text: true
    },
    filePath: String,
    fileType: {
        type: String,
        enum: ['image', 'video']
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    uploadedIn: {
        type: Schema.Types.ObjectId,
        ref: "Group"
    }
}, {
    timestamps: true
});

const Treko = model("Treko", trekoSchema);

module.exports = Treko;