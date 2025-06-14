import express from "express" 
import mongoose from "mongoose"

let questionsSchema = new mongoose.Schema({
    examId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Examtemplate",
        required : true
    },
    subject : {
        type : String, 
        required : true
    },
    qnumber : {
        type : Number,
        required : true
    },
    statement : {
        type : String,
        required : true
    },
    options : [{type : String}],
    correctAnswer : {
        type : String, 
        required : true
    }
},
{
    timestamps : true
})

let Questions = mongoose.model("Questions", questionsSchema) ;

export default Questions ;