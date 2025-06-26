import express, { response } from "express"
import mongoose from "mongoose"
import authorization from "./Authorization.js";
import User from "../models/user.js";
import Examtemplate from "../models/examtemplate.js";
import Attempts from "../models/attempts.js" ;
import Questions from "../models/questions.js";
import Responses from "../models/response.js";

let router = express.Router() ;

router.get('/', authorization.userAuthorization, async(req, res) => {
    console.log(req.userId) ;
    console.log("this is working") ;
})

router.get('/getProfile', authorization.userAuthorization, async(req, res) => {
    let id = req.userId ;
    try {
        let data = await User.find({ _id : id }, 'name emailId') ;
        return res.status(200).json({
            status : true,
            message : "found the profile",
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

router.get('/getExams', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    console.log(userId) ;
    try {
        let attemptedData = await Attempts.find({ completed : true, userId : userId }, 'examId -_id') ;
        let attemptedTests = [] ;
        for(let i=0;i<attemptedData.length;i++) {
            attemptedTests.push(attemptedData[i].examId.toString()) ;
        }
        console.log(attemptedTests) ;
        let data = await Examtemplate.find({ set : true, _id : { $nin: attemptedTests } }) ;
        return res.status(200).json({
            status : true, 
            message : "fetched the tests information",
            data : data
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : true, 
            message : "Internal Server Error"
        })
    }
})

router.get('/takeTest/:id', async(req, res) => {
    let examId = req.params.id ;
    let userId = "683d97b8ce370b91bed565ab" ;
    try {
        let data = await Examtemplate.find({ _id : examId }) ;
        data = data[0] ;
        // console.log(data.title) ;
        let questions = [] ;
        for(let i=0;i<data.sections.length;i++) {
            let squestions = await Questions.find({ examId : examId, subject : i }, 'statement options') ;
            questions.push(squestions) ;
        }
        let attempt = await Attempts.find({ userId : userId, examId : examId }) ;
        if(attempt.length == 0) {
            let newAttempt = new Attempts({
                userId : userId, 
                examId : examId, 
                timeRemaining : data.timeDuration,
                completed : false
            })
            await newAttempt.save() ;
        }
        else {
            if(attempt[0].completed == true) {
                
            }
        }
        res.render('test', { data : data, questions : questions }) ;
    }
    catch(error) {
        console.log(error) ;
    }
})

router.post('/submitAnswer/:questionId', authorization.userAuthorization, async(req, res) => {
    console.log("got the request") ;
    let userId = req.userId ;
    let questionId = req.params.questionId ;
    let examId = req.body.examId ;
    console.log(req.body) ;
    try {
        let data = await Responses.find({ examId : examId, questionId : questionId, userId : userId }) ;
        let question = await Questions.find({ _id : questionId }) ;
        if(data.length == 0) {
            if(req.body.type == 0) {
                return res.status(200).json({
                    status : true, 
                    message : "answer not submitted"
                })
            }
            let response = new Responses({
                examId : examId, 
                userId : userId,
                questionId : questionId,
                answer : req.body.answer,
                type : req.body.type
            })
            await response.save() ;
            return res.status(200).json({
                status : true,
                message : "response saved successfully"
            })
        }
        else {
            let data = await Responses.updateOne({ examId : examId, questionId : questionId, userId : userId}, { answer : req.body.answer, type : req.body.type }) ;
            return res.status(200).json({
                status : true,
                message : "response saved successfully"
            })
        }
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/getOptions/:examId', authorization.userAuthorization, async(req, res) => {

    console.log("getting the request")
    let userId = req.userId ;
    let examId = req.params.examId ;
    try {
        let data = await Responses.find({ userId : userId, examId : examId }) ;
        let optionsMap = new Map() ;
        for(let i=0;i<data.length;i++) {
            optionsMap.set(data[i].questionId.toString(), data[i].answer) ;
        }
        let optionsArray = Array.from(optionsMap);
        return res.status(200).json({
            status : true,
            message : "got the details",
            data : optionsArray
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "unable to load the details"
        })
    }
})

router.get('/getTimer/:examId', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.params.examId ;
    console.log(userId)
    try {
        let data = await Attempts.find({ examId : examId, userId : userId }) ;
        if(data.length == 0) {
            return res.status(404).json({
                status : false, message : "unauthorized route"
            })
        }
        data = data[0] ;
        return res.status(200).json({
            status : true, 
            message : "got the details",
            data : data.timeRemaining
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

router.post('/updateTimer/:examId', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.params.examId ;
    try {
        await Attempts.updateOne({ examId : examId, userId : userId}, { timeRemaining : req.body.timeRemaining }) ;
        return res.status(200).json({
            status : true, 
            message : "timer updated successfully"
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

router.get('/submitTest/:examId', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.params.examId ;
    try {
        await Attempts.updateOne({ examId : examId, userId : userId }, {completed : true, timeRemaining : 0}) ;
        return res.status(200).json({
            status : true,
            message : "test submitted successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/getButtonsStatus/:examId', authorization.userAuthorization, async(req, res) => {
    let examId = req.params.examId ;
    let userId = req.userId ;
    try {
        let data = await Responses.find({ userId : userId, examId : examId, $or : [ { type : 1 }, { type : 2 }] }, 'questionId type -_id') ;
        return res.status(200).json({
            status : true,
            message : "got the details",
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

export default router ;