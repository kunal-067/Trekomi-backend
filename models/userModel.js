const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Group = require("./group.model");

const userSchema = mongoose.Schema({
  name: {
    type: "String",
    required: true
  },
  email: {
    type: "String",
    unique: true,
    required: true
  },
  password: {
    type: "String",
    required: true
  },
  pic: {
    type: "String",
    required: true,
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  groups: [{
    joinedAt: Date,
    groupId: mongoose.Schema.Types.ObjectId,
    approved: {
      type: Boolean,
      default: false
    }
  }],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestaps: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isGroupAdmin = async function(groupId){
  try {
    const group = await Group.findById(groupId);
    if(!group) return false;
    if(group.admin.equals(this._id)){
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;