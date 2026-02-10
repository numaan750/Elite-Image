import mongoose from "mongoose";

const loginUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
     credits: {
        type: Number,
        default: 15,  // Free signup credits
    },
});

const loginUser = mongoose.model("loginUser", loginUserSchema);
export default loginUser