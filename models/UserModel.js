const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required: true
    },
    LastName:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
        unique:[true,"password should be unique and strong for security purpose"]
    },
    confirmpassword:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required : true
    }
})

module.exports = mongoose.model("UserModel",userSchema)