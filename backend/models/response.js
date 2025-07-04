import express from "express"
import mongoose from "mongoose"

let responseSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    examId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Examtemplate",
        required : true
    },
    questionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Questions",
        required : true
    },
    answer : {
        type : String,
        required : true
    },
    correct : {
        type : Boolean
    },
    type : {
        type : Number,
        required : true
    }
},
{
    timestamps : true
})

let Responses = mongoose.model("Responses", responseSchema) ;

export default Responses ;