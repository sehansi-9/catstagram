const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('../keys')
const mongoose = require('mongoose')
const User =mongoose.model("User")

    module.exports = (req,res,next)=>{
    const{authorization} =req.headers //const authorization = req.headers.authorization;
    //authorization == Bearer shjjdhdhjdj
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})
    }
    const token =authorization.replace("Bearer","")
    jwt.verify(token, JWT_SECRET, (err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }

        const {_id}= payload; //const _id = payload._id;
        User.findById(_id).then(userdata=>{
            req.user=userdata;
            next();
        });
        
    })
}