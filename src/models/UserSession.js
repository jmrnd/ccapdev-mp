import mongoose from "mongoose";

const UserSessionSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const UserSession = mongoose.model("UserSession", UserSessionSchema);

export default UserSession;
