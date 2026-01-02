import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
const User = mongoose.model('User');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../keys.js';

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({
        $or: [
            { email: email },
            { name: name }
        ]
    })
        .then((savedUser) => {
            if (savedUser) {
                if (savedUser.email === email) {
                    return res.status(422).json({ error: "User already exists with that email" });
                } else if (savedUser.name === name) {
                    return res.status(422).json({ error: "User already exists with that username" });
                }
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic: pic
                    });

                    user.save()
                        .then(user => {
                            res.json({ message: "Saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
        })
        .catch(err => {
            console.log(err);
        });
});


router.post('/signin', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(422).json({ error: "please add username or password" });
    }
    User.findOne({ name: name })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid username or password" }); //invalid email
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({message:"successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, pic, bio } = savedUser;
                        res.json({ token: token, user: { _id, name, email, followers, following, pic, bio } });
                    }
                    else {
                        res.json({ message: "invalid user name or password" }); //invalid password
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });


});


export default router;
