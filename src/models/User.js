import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    displayName: String,
    description: String,
    email: {
        type:String,
        required: true,
        unique: true
    },
    icon: String,
    password: {
        type:String,
        require:true,
    },
    joinDate: Date,
});

export const User = mongoose.model("User", UserSchema);

export default User;
