import express from "express"
import mongoose from "mongoose"

const countSchema = new mongoose.Schema({
    examId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Examtemplate",
        required : true
    },
    subject : {
        type : Number, 
        required : true
    },
    questions : [
        {
            type : Number
        }
    ]
})

const Questioncount =  mongoose.model("Questioncount", countSchema) ;

export default Questioncount ;