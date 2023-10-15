const mongoose = require("mongoose")
const mentorSchema = new mongoose.Schema({
    Name:{type:String,required:[true," Name is required"]},
    Email:{type:String,required:[true,"Email is required"]},
    studentlist:{type:Array}
})

const mentorModel = mongoose.model('mentors',mentorSchema)
module.exports  = mentorModel