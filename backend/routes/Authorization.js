import express from "express"
import jwt from "jsonwebtoken"
import Admin from "../models/admin.js";
import User from "../models/user.js";

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
    userAuthorization
}