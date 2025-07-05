import express from "express"
import jwt from "jsonwebtoken"
import Admin from "../models/admin.js";
import User from "../models/user.js";
import Examtemplate from "../models/examtemplate.js";

let secretKey = "secretkey" ;

async function userAuthorization(req, res, next) {
    let token = req.headers.authorization ;
    token = token.split(/\s+/).at(1) ;
    // console.log(token) ;
    try {
        const decoded = jwt.verify(token, secretKey) ;
        let emailId = decoded.emailId ;
        let data = await User.find({ emailId : emailId}) ;
        if(data.length == 0) {
            return res.status(400).json({
                code : 2002, 
                status : false, 
                message : "JWT token corrupted"
            })
        }
        req.userId = data[0]._id.toString() ;
    }
    catch(error) {
        if (error.name === 'TokenExpiredError') {
            console.log("token expired") ;
            return res.status(404).json({
                status : false, 
                code : 2001,
                message : "JWT token expired"
            })
        }
        return res.status(400).json({
            code : 2002, 
            status : false, 
            message : "JWT token corrupted"
        })
    }
    next() ;
}

async function tokenAuthorization(req, res, next) {
    let token = req.params.token ;
    // console.log(token) ;
    try {
        const decoded = jwt.verify(token, "secretKey") ;
        // console.log(decoded) ;
        let examId = decoded.examId ;
        let userId = decoded.userId ;
        let data = await User.find({ _id : userId}) ;
        // console.log(data) ;
        if(data.length == 0) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end('<h1 style="text-align : center">Invalid Route</h1>');
        }
        req.userId = data[0]._id.toString() ;
        data = await Examtemplate.find({ _id : examId }) ;
        // console.log(data) ;
        if(data.length == 0) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end('<h1 style="text-align : center">Invalid Route</h1>');
        }
        req.examId = data[0]._id.toString() ;
        // console.log("working") ;
    }
    catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end('<h1 style="text-align : center">Invalid Route</h1><h1 style="text-align : center">Go Back to Login</h1>');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end('<h1 style="text-align : center">Invalid Route</h1>');
    }
    next() ;
}

async function adminAuthorization(req, res, next) {
    let token = req.headers.authorization ;
    token = token.split(/\s+/).at(1) ;
    try {
        const decoded = jwt.verify(token, secretKey) ;
        let emailId = decoded.emailId ;
        let data = await Admin.find({ emailId : emailId }) ;
        if(data.length == 0) {
            return res.status(400).json({
                code : 2002, 
                status : false, 
                message : "JWT token corrupted"
            })
        }
        console.log("authorization is done") ;
    }
    catch(error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(404).json({
                status : false, 
                code : 2001,
                message : "JWT token expired"
            })
        }
        return res.status(400).json({
            code : 2002, 
            status : false, 
            message : "JWT token corrupted"
        })
    }
    next() ;
}

export default {
    adminAuthorization,
    userAuthorization,
    tokenAuthorization
}