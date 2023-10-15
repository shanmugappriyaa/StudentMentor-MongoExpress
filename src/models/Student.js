const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    Name:{type:String,required:[true,"Name is required"]},
    Email:{type:String,required:[true,"Email is required"]},
    Batch:{type:String,required:[true,"Batch is required"]},
    currentMentor:{type:String},
    previousMentor:{type:String}
})
 const studentModel = mongoose.model('students',studentSchema)
 module.exports = studentModel