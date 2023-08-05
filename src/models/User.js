import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    description: String,
    email: String,
    icon: String,
    password: String, // TODO: password hashing for phase 3
    joinDate: Date,
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
});

export const User = mongoose.model("User", UserSchema);

export default User;
