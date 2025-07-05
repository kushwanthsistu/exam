import express from "express"
import mongoose from "mongoose"

let examSchema = new mongoose.Schema({
    title : {
        type : String, 
        required : true
    },
    totalQuestions : {
        type : Number, 
        required : true
    },
    sections : [
        {
            subject : {
                type : String, required : true
            },
            questionsCount : {
                type : Number, required : true
            },
            // marks : {
            //     type : Number, required : true
            // }
        }
    ],
    timeDuration : {
        type : Number,
        required : true
    },
    marks : {
        positiveMarks : {
            type : Number, 
            required : true
        },
        negativeMarks : {
            type : Number, 
            required : true
        }
    },
    set : {
        type : Boolean,
        required : true,
        default : false
    },
    enabled : {
        type : Boolean, 
        required : true,
        default : false
    }
},
{
    timestamps : true
})

let Examtemplate = mongoose.model("Examtemplate", examSchema) ;

export default Examtemplate ;