import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    description: String,
    email: String,
    icon: String,
    password: String,
    joinDate: Date
});

export const User = mongoose.model('User', UserSchema);

export default User;