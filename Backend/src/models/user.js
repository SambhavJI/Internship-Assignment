import mongoose from "mongoose";

const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ["admin", "user"]
    }
});

const User = mongoose.model("User", schema);

export default User;