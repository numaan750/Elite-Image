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
});

const loginUser = mongoose.model("loginUser", loginUserSchema);
export default loginUser