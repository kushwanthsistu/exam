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