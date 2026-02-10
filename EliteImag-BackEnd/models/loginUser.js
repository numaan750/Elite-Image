import mongoose from "mongoose";

const loginUserSchema = new mongoose.Schema({
    username: {
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
        required: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
     credits: {
        type: Number,
        default: 15,
    },
});

const loginUser = mongoose.model("loginUser", loginUserSchema);
export default loginUser