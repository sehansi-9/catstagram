import mongoose from 'mongoose';
const User = mongoose.model('User');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../keys.js';

export const signup = async (name, email, password, pic) => {
    if (!email || !password || !name) {
        throw new Error("Please add all the fields");
    }

    const savedUser = await User.findOne({
        $or: [
            { email: email },
            { name: name }
        ]
    });

    if (savedUser) {
        if (savedUser.email === email) {
            throw new Error("User already exists with that email");
        } else if (savedUser.name === name) {
            throw new Error("User already exists with that username");
        }
    }

    const hashedpassword = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        password: hashedpassword,
        name,
        pic: pic
    });

    await user.save();
    return { message: "Saved successfully" };
};

export const signin = async (name, password) => {
    if (!name || !password) {
        throw new Error("please add username or password");
    }
    const savedUser = await User.findOne({ name: name });

    if (!savedUser) {
        throw new Error("Invalid username or password");
    }

    const doMatch = await bcrypt.compare(password, savedUser.password);
    if (doMatch) {
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
        const { _id, name, email, followers, following, pic, bio } = savedUser;
        return { token, user: { _id, name, email, followers, following, pic, bio } };
    } else {
        throw new Error("invalid user name or password");
    }
};
