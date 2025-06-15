import express from "express"
import mongoose from "mongoose"
import Examtemplate from "../models/examtemplate.js"
import Questioncount from "../models/questioncount.js";
import Questions from "../models/questions.js";
import authorization from "./authorization.js";

let router = express.Router() ;

router.get('/getOngoingTests', async(req, res) => {
    try {
        let data = await Examtemplate.find({ set : true, enabled : true}) ;
        res.status(200).json({
            status : true, 
            message : "got the exam details",
            data : data
        })
    }
    catch(error) {
        console.log(error) ;
        res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/disableTest/:examId', async (req, res) => {
    let examId = req.params.examId ;
    try {
        let result = await Examtemplate.updateOne(
            {
                _id : examId
            }, 
            {
                enabled : false
            }
        )
        if(result.modifiedCount != 1) {
            return res.status(500).json({
                status : false, 
                message : "Internal Server Error"
            })
        }
        return res.status(200).json({
            status : true, 
            message : "test disabled successfully"
        })
    }
    catch(errro) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/enableTest/:examId', async (req, res) => {
    let examId = req.params.examId ;
    try {
        let result = await Examtemplate.updateOne(
            {
                _id : examId
            }, 
            {
                enabled : true
            }
        )
        if(result.modifiedCount != 1) {
            return res.status(500).json({
                status : false, 
                message : "Internal Server Error"
            })
        }
        return res.status(200).json({
            status : true, 
            message : "test enabled successfully"
        })
    }
    catch(errro) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/getDisabledTests', async (req, res) => {
    try {
        let data = await Examtemplate.find({ set : true, enabled : false}) ;
        res.status(200).json({
            status : true, 
            message : "got the details", 
            data : data 
        })
    }
    catch(error) {
        console.log(error) ;
        res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

export default router ;