import express, { response } from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
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
        data = data[0] ;
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

router.get('/getPendingExams', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    try {
        let data = await Attempts.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed : false
      }
    },
    {
      $lookup: {
        from: 'examtemplates',         // collection name (not model)
        localField: 'examId',          // from Attempts
        foreignField: '_id',           // from Examtemplate
        as: 'exam'
      }
    },
    {
      $unwind: '$exam' // flatten the joined exam array
    },
    {
      $addFields: {
        examTitle: '$exam.title'
      }
    },
    {
      $project: {
        exam: 0 // exclude full exam object (optional)
      }
    }
  ]);
  console.log(data) ;
        return res.status(200).json({
            status : true, 
            message : "successfully got the details of the test",
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

router.get('/getCompletedExams', authorization.userAuthorization, async(req, res) => {
    let userId = req.userId ;
    try {
        let data = await Attempts.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed : true
      }
    },
    {
      $lookup: {
        from: 'examtemplates',         // collection name (not model)
        localField: 'examId',          // from Attempts
        foreignField: '_id',           // from Examtemplate
        as: 'exam'
      }
    },
    {
      $unwind: '$exam' // flatten the joined exam array
    },
    {
      $addFields: {
        examTitle: '$exam.title'
      }
    },
    {
      $project: {
        exam: 0 // exclude full exam object (optional)
      }
    }
  ]);
        return res.status(200).json({
            status : true, 
            message : "successfully got the details of the test",
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
        let data = await Examtemplate.find({ set : true, enabled : true, _id : { $nin: attemptedTests } }) ;
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

router.get('/takeTest/:token', authorization.tokenAuthorization, async(req, res) => {
    console.log("getting this") ;
    // let token = req.params.token ;
    // let examId, userId ;
    // try {
    //     const decoded = jwt.verify(token, "secretKey") ;
    //     // console.log(decoded) ;
    //     examId = decoded.examId ;
    //     userId = decoded.examId ;
    // }
    // catch(error) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.end('<h1 style="text-align : center">Invalid Route</h1>');
    // }
    let examId = req.examId ;
    let userId = req.userId ;
    // console.log(userId) ;
    // let userId = "683d97b8ce370b91bed565ab" ;
    console.log("working till here") ;
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
        // else {
        //     if(attempt[0].completed == true) {
                
        //     }
        // }
        // console.log(data) ;
        // console.log(questions) ;
        res.render('test1', { data : data, questions : questions }) ;
    }
    catch(error) {
        console.log(error) ;
    }
})

router.get('/analysis/:token', authorization.tokenAuthorization, async(req, res) => {
    // console.log("getting this") ;
    // let token = req.params.token ;
    // let examId, userId ;
    // try {
    //     const decoded = jwt.verify(token, "secretKey") ;
    //     // console.log(decoded) ;
    //     examId = decoded.examId ;
    //     userId = decoded.examId ;
    // }
    // catch(error) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' });
    //     res.end('<h1 style="text-align : center">Invalid Route</h1>');
    // }
    let examId = req.examId ;
    let userId = req.userId ;
    // console.log(userId) ;
    // let userId = "683d97b8ce370b91bed565ab" ;
    // console.log("working till here") ;
    try {
        let data = await Examtemplate.find({ _id : examId }) ;
        data = data[0] ;
        // console.log(data.title) ;
        let questions = [] ;
        for(let i=0;i<data.sections.length;i++) {
            let squestions = await Questions.find({ examId : examId, subject : i }, 'statement options correctAnswer') ;
            questions.push(squestions) ;
        }
        // console.log(questions) ;
        let attempt = await Attempts.find({ userId : userId, examId : examId }) ;
        attempt = attempt[0] ;
        // else {
        //     if(attempt[0].completed == true) {
                
        //     }
        // }
        // console.log(data) ;
        // console.log(questions) ;
        res.render('analysis1', { data : data, questions : questions, attempt : attempt }) ;
    }
    catch(error) {
        console.log(error) ;
    }
})

router.get('/getAnswers/:token/:id', authorization.tokenAuthorization, async(req, res) => {
    // console.log("this route is working") ;
    let userId = req.userId ;
    let examId = req.examId ;
    let questionId = req.params.id ;
    try {
        let data = await Responses.find({ userId : userId, examId : examId, questionId : questionId }) ;
        if(data.length != 0) {
        data = data[0] ;
        console.log(data) ;
        return res.status(200).json({
            status : true, 
            data : data
        })}
        else {
            return res.status(200).json({
                status : false, 
                message : "question is not answered"
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

router.get('/getQuestionStatus/:token', authorization.tokenAuthorization, async(req, res) => {
    // console.log("got till here") ;
    let userId = req.userId ;
    let examId = req.examId ;
    try {
        let correctAnswers = await Responses.find({ userId : userId, examId : examId, correct : true}) ;
        // console.log(correctAnswers) ;
        let correct = [] ;
        let wrong = [] ;
        // let correct = [] ;
        for(let i=0;i<correctAnswers.length;i++) {
            correct.push(correctAnswers[i].questionId.toString()) ;
        }
        let wrongAnswers = await Responses.find({ userId : userId, examId : examId, correct : false}) ;
        for(let i=0;i<wrongAnswers.length;i++) {
            wrong.push(wrongAnswers[i].questionId.toString()) ;
        }
        return res.status(200).json({
            status : true, 
            data : {
                correctAnswers : [...correct] ,
                wrongAnswers : [...wrong]
            }
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

router.get('/authenticateForTest/:examId', authorization.userAuthorization, async(req, res) => {
    let examId = req.params.examId ;
    let userId = req.userId ;
    const token = jwt.sign({
        userId : userId,
        examId : examId
    }, "secretKey", { expiresIn: '10h' });
    if(token) {
        return res.status(200).json({
            status : true, 
            message : "sending the token",
            data : token
        })
    }
    else {
        return res.status(500).json({
            status : false,
            message : "Internal Server Error"
        })
    }
})

router.post('/submitAnswer/:token/:questionId', authorization.tokenAuthorization, async(req, res) => {
    // console.log("got the request") ;
    let userId = req.userId ;
    let questionId = req.params.questionId ;
    let examId = req.examId ;
    console.log(req.body) ;
    try {
        let data = await Responses.find({ examId : examId, questionId : questionId, userId : userId }) ;
        let question = await Questions.find({ _id : questionId }) ;
        if(data.length == 0) {
            // if(req.body.type == 0) {
            //     return res.status(200).json({
            //         status : true, 
            //         message : "answer not submitted"
            //     })
            // }
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

router.post('/markforreview/:token/:questionId', authorization.tokenAuthorization, async(req, res) => {
    // console.log("got the request") ;
    let userId = req.userId ;
    let questionId = req.params.questionId ;
    let examId = req.examId ;
    console.log(req.body) ;
    try {
        let data = await Responses.find({ examId : examId, questionId : questionId, userId : userId }) ;
        let question = await Questions.find({ _id : questionId }) ;
        if(data.length == 0) {
            // if(req.body.type == 0) {
            //     return res.status(200).json({
            //         status : true, 
            //         message : "answer not submitted"
            //     })
            // }
            let response = new Responses({
                examId : examId, 
                userId : userId,
                questionId : questionId,
                answer : "",
                type : req.body.type
            })
            await response.save() ;
            return res.status(200).json({
                status : true,
                message : "response saved successfully"
            })
        }
        else {
            let data = await Responses.updateOne({ examId : examId, questionId : questionId, userId : userId}, { type : req.body.type }) ;
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

// got an issue here rectified by changing :exam to :token.
router.get('/getOptions/:token', authorization.tokenAuthorization, async(req, res) => {
    console.log("this route is working fine") ;
    let userId = req.userId ;
    let examId = req.examId ;
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

router.get('/getTimer/:token', authorization.tokenAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.examId ;
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

router.post('/updateTimer/:token', authorization.tokenAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.examId ;
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

// router.get('/getAnswerAnalysis/:token', authorization.tokenAuthorization, async(req, res) => {
//     let userId = req.userId ;
//     let examId = req.examId ;
//     try {

//     }
// })

router.get('/submitTest/:token', authorization.tokenAuthorization, async(req, res) => {
    let userId = req.userId ;
    let examId = req.examId ;
    try {
        await Attempts.updateOne({ examId : examId, userId : userId }, {completed : true, timeRemaining : 0}) ;
        res.status(200).json({
            status : true,
            message : "test submitted successfully"
        })
        let examtemplate = await Examtemplate.find({ _id : examId }) ;
        examtemplate = examtemplate[0] ;
        console.log(examtemplate) ;
        let positiveMarks = examtemplate.marks.positiveMarks ;
        let negativeMarks = examtemplate.marks.negativeMarks ;
        let totalMarks = positiveMarks*examtemplate.totalQuestions ;
        let responses = await Responses.find({ examId : examId, userId : userId }) ;
        let marks = 0 ;
        for(let i=0;i<responses.length;i++) {
            let id = responses[i].questionId ;
            let question = await Questions.find({ _id : id }) ;
            question = question[0] ;
            if(question.correctAnswer == responses[i].answer) {
                marks = marks + positiveMarks ;
                await Responses.updateOne({ examId : examId, userId : userId, questionId : id }, { correct : true }) ;
            }
            else {
                marks = marks - negativeMarks ;
                await Responses.updateOne({ examId : examId, userId : userId, questionId : id }, { correct : false }) ;
            }
            console.log(marks) ;
        }
        await Attempts.updateOne({ userId : userId, examId : examId }, { totalMarks : totalMarks, marksScored : marks }) ;
        // responses = await Responses.find({ examId : examId, userId : userId }) ;
        // console.log(responses) ;
        // let attempt = await Attempts.find({ userId : userId, examId : examId }) ;
        // console.log(attempt) ;
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
})

router.get('/getButtonsStatus/:token', authorization.tokenAuthorization, async(req, res) => {
    let examId = req.examId ;
    let userId = req.userId ;
    try {
        let data = await Responses.find({ userId : userId, examId : examId }, 'questionId type -_id') ;
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