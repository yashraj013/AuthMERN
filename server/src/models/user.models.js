import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    useremail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    verifyotp: {
        type: String,
        default: ''
    },
    verifyotpExpiredAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetotp: {
        type: String,
        default: ''
    },
    resetotpExpiredAt: {
        type: Number,
        default: 0
    }
},{timestamps: true}); 

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;