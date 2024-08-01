const mongoose = require('mongoose')
const {ObjectId}= mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    pic:{
        type:String,
        default: "https://res.cloudinary.com/sehansi/image/upload/v1718453622/6ad237c8a1922205b39c5afdc01b5b1d_s10psq.jpg",
    },

    bio: {
        type: String,
        default: "", // Set a default value for the bio
    },
  
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    
})

mongoose.model("User", userSchema)