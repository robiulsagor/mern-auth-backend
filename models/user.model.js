import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verifyOpt: {
    type: String,
    default: "",
  },
  verifyOptExpiresAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOpt: {
    type: String,
    default: "",
  },
  resetOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel;
