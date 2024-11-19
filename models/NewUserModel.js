const mongoose = require('mongoose')

const newUserSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true

    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Department:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("NewUserModel",newUserSchema)