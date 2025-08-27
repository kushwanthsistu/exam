import express from "express"
import mongoose from "mongoose"
import Examtemplate from "../models/examtemplate.js"
import Questioncount from "../models/questioncount.js";
import Questions from "../models/questions.js";
import Responses from "../models/response.js" ;
import Attempts from "../models/attempts.js" ;
import authorization from "./Authorization.js";
import User from "../models/user.js";

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

router.get('/getDraftTests', async(req, res) => {
    try {
        let data = await Examtemplate.find({ set : false }) ;
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

router.get('/editTest/:id', async(req, res) => {
    let id = req.params.id ;
    try {
        let data = await Examtemplate.find({ _id : id }) ;
        // console.log(data) ;
        res.render('index1', { data : data[0] });
    }
    catch(error) {
        console.log(error) ;
    }
})

router.get('/deleteTest/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Responses.deleteMany({ examId : id }) ;

        await Attempts.deleteMany({ examId : id }) ;

        await Examtemplate.deleteOne({ _id: id });

        return res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting test" });
    }
});

router.get('/getQuestion/:examId/:subject/:qnumber', async(req, res) => {
    let {examId, subject, qnumber} = req.params ;
    console.log(examId) ;
    console.log(subject) ;
    console.log(qnumber) ;
    try {
        let data = await Questions.find({ examId : examId, subject : subject, qnumber : qnumber }) ;
        if(data.length === 0) {
            return res.status(200).json({
                status : true, 
                code : 2001, 
                message : "the question is not found",
                data : {}
            })
        }
        return res.status(200).json({
            status : true, 
            code : 1001,
            message : "found the question",
            data : data[0]
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

router.get('/testAnalysis/:testid', async (req, res) => {
    const testid = req.params.testid;

    try {
        const data = await Attempts.find({ examId: testid, completed: true });

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No completed attempts found for this test"
            });
        }

        console.log(data);

        // Fetch user names for all unique userIds
        const userIds = [...new Set(data.map(item => item.userId))]; // unique userIds
        const users = await User.find({ _id: { $in: userIds } }, { name: 1 });

        // Create a map for quick user lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.name;
        });

        // Build the participants array (sorted by marksScored desc)
        const participants = data
            .map(item => ({
                name: userMap[item.userId] || "Unknown User",
                marksScored: item.marksScored !== undefined ? item.marksScored : 0
            }))
            .sort((a, b) => b.marksScored - a.marksScored);

        // Safely get totalMarks from any valid attempt
        const validTotal = data.find(item => item.totalMarks !== undefined);
        const totalMarks = validTotal ? validTotal.totalMarks : 0;


        // Calculate statistics
        const totalParticipants = participants.length;
        const totalMarksScored = participants.reduce((acc, curr) => acc + curr.marksScored, 0);
        const averageMarks = parseFloat((totalMarksScored / totalParticipants).toFixed(2));
        const maxMarks = Math.max(...participants.map(p => p.marksScored));
        const minMarks = Math.min(...participants.map(p => p.marksScored));

        return res.status(200).json({
            status: true,
            message: "Test analysis fetched successfully",
            data: {
                participants,
                totalParticipants,
                totalMarks,
                averageMarks,
                maxMarks,
                minMarks
            }
        });

    } catch (error) {
        console.error("Error in testAnalysis API:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
});

router.post('/saveQuestion/:examId/:subject/:qnumber', async(req, res) => {
    let {examId, subject, qnumber} = req.params ;
    try {
        if(req.body.updated.length == 0) {
            console.log("nothing updated") ;
            return res.status(200).json({
                status : true, 
                message : "successfully saved the question to the draft" 
            })
        }
        let data = await Questions.find({ examId : examId, subject : subject, qnumber : qnumber }) ;
        if(data.length === 0) {
            let question = {} ;
            question.statement = req.body.statement ;
            question.options = req.body.options ;
            question.correctAnswer = req.body.correctAnswer ;
            question.examId = examId ;
            question.subject = subject ;
            question.qnumber = qnumber ;
            let Question = new Questions(question) ;
            await Question.save() ;
        }
        else {
            let updatedQuestion = {} ;
            let updated = req.body.updated ;
            for(let i=0;i<updated.length;i++) {
                updatedQuestion[updated[i]] = req.body[updated[i]] ;
            }
            let data = await Questions.updateOne({ examId : examId, subject : subject, qnumber : qnumber}, updatedQuestion) ;
        }
        let questionCount = await Questioncount.find({ examId : examId, subject : subject }) ;
        console.log(Questioncount) ;
        let questions = questionCount[0].questions ;
        if(req.body.complete) {
            if(!questions.includes(qnumber)) {
                questions.push(qnumber) ;
                await Questioncount.updateOne({ examId : examId, subject : subject}, {questions : questions}) ;
            }
        }
        else {
            const index = questions.indexOf(qnumber);
            if (index !== -1) {
                questions.splice(index, 1); // Removes 1 item at the found index
            }
            await Questioncount.updateOne({ examId : examId, subject : subject}, {questions : questions}) ;
        }
        return res.status(200).json({
            status : true, 
            message : "successfully saved the question"
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

async function findError(questions, sectionNumber, tQuestions, examId) {
    questions.sort((a, b) => a - b);
    for(let i=1;i<=tQuestions;i++) {
        if(questions[i-1] != i) {
            let data = await Questions.find({ examId : examId, subject : sectionNumber, qnumber : i}) ;
            data = data[0] ;
            if(!data.statement) {
                return `section ${sectionNumber+1} question ${i} statement is not completed` ;
            }
            if(data.options.length < 2) {
                return `section ${sectionNumber+1} question ${i}, minimum 2 options should be provided` ;
            }
            for(let j=0;j<data.options.length;j++) {
                if(!data.options[j]) {
                    return `section ${sectionNumber+1} question ${i} option ${j+1}, options should be provided` ;
                }
            }
            if(!data.correctAnswer) {
                return `section ${sectionNumber+1} question ${i} correct answer should be provided` ;
            }
            let j ;
            for(j=0;j<data.options.length;j++) {
                if(data.options[j] == data.correctAnswer)
                    break ;
            }
            console.log(j) ;
            if(j == data.options.length) {
                return `section ${sectionNumber+1} question ${i}, correct answer should be one of the given options` ;
            }
            return `section${sectionNumber+1} question ${i}, check the question` ;
        }
    }
    return "this function is working fine" ;
}

router.get('/uploadTest/:examId', async(req, res) => {
    let examId = req.params.examId ;
    try {
        let data = await Questioncount.find({ examId : examId }) ;
        let testData = await Examtemplate.find({ _id : examId }) ;
        testData = testData[0].sections ;
        for(let i=0;i<data.length;i++) {
            if(testData[i].questionsCount == data[i].questions.length) {
                continue ;
            }
            let message = await findError(data[i].questions, i, testData[i].questionsCount, examId) ;
            return res.status(422).json({
                status : false, 
                message : message
            })
        }
        await Examtemplate.updateOne({ _id : examId}, {set : true, enabled : true }) ;
        return res.status(200).json({
            status : true, 
            message : "test is uploaded successfully" 
        })
    }
    catch(error) {
        console.log(error) ;
    }
})

router.get('/', async(req, res) => {
    console.log("this route is called upon") ;
})

export default router ;