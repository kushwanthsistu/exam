import express from "express"
import mongoose from "mongoose"
import Examtemplate from "../models/examtemplate.js"
import Questioncount from "../models/questioncount.js";
import Questions from "../models/questions.js";
import authorization from "./Authorization.js";

let router = express.Router() ;

router.post('/setTemplate', async(req, res) => {
    console.log("got the request") ;
    let { title, sections, timeDuration, marks, totalQuestions, totalMarks } = req.body ;
    try {
        let data = await Examtemplate.find({ title : title }) ;
        console.log(data) ;
        if(data.length != 0) {
            return res.status(400).json({
                status : false, 
                code : 3001, 
                message : "Title already exists"
            })
        }
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal DB Error"
        })
    }
    try {
        // console.log(sections) ;
        let examTemplate = new Examtemplate({
            title : title, 
            sections : sections,
            timeDuration : timeDuration,
            totalQuestions : totalQuestions,
            marks : marks
        }) ;
        let data = await examTemplate.save() ;
        for(let i = 0;i<sections.length;i++) {
            let questionCount = new Questioncount({
                examId : data._id.toString(),
                subject : i,
                questions : []
            })
            await questionCount.save() ;
        }
        return res.status(200).json({
            status : true,
            message : "Exam created successfully",
            examId : data._id.toString()
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal DB Error"
        })
    }
})

router.get('/testing', authorization.adminAuthorization, async(req, res) => {
    console.log("this route is working fine") ;
})

router.get('/getTemplate/:examId', authorization.adminAuthorization, async (req, res) => {
    let examId = req.params.examId ;
    try {
        let data = await Examtemplate.find({ _id : examId}) ;
        if(data.length == 0) {
            return res.status(404).json({
                status : false, 
                code : 4001, 
                message : "The requested question paper is not available"
            })
        }
        let template = data[0] ;
        return res.status(200).json({
            status : true, 
            message : "successfully got the details of the test",
            template : template
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Errro"
        })
    }
})

router.get('/getCount/:examId/:subject', authorization.adminAuthorization, async(req, res) => {
    let {examId, subject} = req.params ;
    console.log(req.params) ;
    try {
        let data = await Questioncount.find({ examId : examId, subject : subject }) ;
        if(data.length == 0) {
            return res.status(400).json({
                status : false, 
                message : "Invalid request" 
            })
        }
        data = data[0] ;
        return res.status(200).json({
            status : true, 
            message : "successfully got the details",
            data : data 
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({ 
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.post('/setQuestion/:examId/:subject/:questionNumber', authorization.adminAuthorization, async (req, res) => {
    let {examId, subject, questionNumber} = req.params ;
    let {statement, options, correctAnswer} = req.body ;
    try {
        let data = await Questions.find({ _id : examId, subject : subject, questionNumber : questionNumber }) ;
        if(data.length == 0) {
            return res.status(400).json({
                status : false, 
                message : "the question already exists"
            })
        }
        let question = new Questions({
            examId : examId, 
            subject : subject, 
            qnumber : questionNumber,
            statement : statement, 
            options : options, 
            correctAnswer : correctAnswer 
        })
        await question.save() ;
        await Questioncount.updateOne({
            examId : examId, 
            subject : subject
        },
        {
            $push: { questions : questionNumber }
        })
        return res.status(200).json({ status : true, message : "question uploaded successfully "}) ;
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({ status : false, message : "Internal Server Error"})
    }
})

export default router ;