import express from "express"
import mongoose from "mongoose"

let attemptsSchema = new mongoose.Schema({
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
    completed : {
        type : Boolean,
        required : true
    },
    totalMarks : {
        type : Number,
        required : true
    },
    marksScored : {
        type : Number,
    }
},
{
    timestamps : true
})