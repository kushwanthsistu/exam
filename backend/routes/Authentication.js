import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import Admin from "../models/admin.js"

let router = express.Router() ;

let secretKey = "secretkey" ;

router.post('/signup', async(req, res) => {
    // console.log("got request") ;
    let {emailId, name, password} = req.body ;
    try {
        let data = await User.find({emailId : emailId}) ;
        if(data.length != 0) {
            return res.status(400).json({
                code : 1001,
                status : false, 
                message : "Email id already exits"
            })
        }
        let hashedPassword = await bcrypt.hash(password, 12);
        let user = new User({
            emailId : emailId,
            name : name,
            password : hashedPassword
        })
        let result = await user.save() ;
        const token = jwt.sign({
            admin : false,
            emailId : emailId
        }, secretKey, { expiresIn: '3h' });
        return res.status(200).json({
            status : true,
            message : "User signed up successfully",
            token : token
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

router.post('/login', async(req, res) => {
    console.log("somebody is trying to login") ;
    console.log(req.body) ;
    let {emailId, password} = req.body ;
    try {
        let data = await User.find({emailId : emailId}) ;
        if(data.length == 0) {
            return res.status(400).json({
                code : 1002,
                status : false, 
                message : "email id doesn't exits"
            })
        }
        let hashedPassword = data[0].password ;
        let result = await bcrypt.compare(password, hashedPassword) ;
        if(!result) {
            return res.status(400).json({
                code : 1003, 
                status : false, 
                message : "Incorrect Password"
            })
        }
        const token = jwt.sign({
            admin : false,
            emailId : emailId
        }, secretKey, { expiresIn: '10h' });
        return res.status(200).json({
            status : true,
            message : "User logged in successfully",
            token : token
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

// {
//     "emailId" : "adminmailid@gmail.com",
//     "password" : "adminpassword"
// }

router.post('/admin/login', async (req, res) => {
    let { emailId, password } = req.body;

    // hardcoded credentials
    const adminEmail = "adminmailid@gmail.com";
    const adminPassword = "adminpassword";  // you can also hash this if you want

    try {
        // check if email matches
        if (emailId !== adminEmail) {
            return res.status(400).json({
                code: 1002,
                status: false,
                message: "email id doesn't exist"
            });
        }

        // check if password matches
        if (password !== adminPassword) {
            return res.status(400).json({
                code: 1003,
                status: false,
                message: "Incorrect Password"
            });
        }

        // generate token
        const token = jwt.sign(
            {
                admin: true,
                emailId: emailId
            },
            secretKey,
            { expiresIn: '3h' }
        );

        return res.status(200).json({
            status: true,
            message: "Admin logged in successfully",
            token: token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
});


/* router.post('/admin/login', async(req, res) => {
    let {emailId, password} = req.body ;
    try {
        let data = await Admin.find({emailId : emailId}) ;
        if(data.length == 0) {
            return res.status(400).json({
                code : 1002,
                status : false, 
                message : "email id doesn't exits"
            })
        }
        let hashedPassword = data[0].password ;
        let result = await bcrypt.compare(password, hashedPassword) ;
        if(!result) {
            return res.status(400).json({
                code : 1003, 
                status : false, 
                message : "Incorrect Password"
            })
        }
        const token = jwt.sign({
            admin : true,
            emailId : emailId
        }, secretKey, { expiresIn: '3h' });
        return res.status(200).json({
            status : true,
            message : "User logged in successfully",
            token : token
        })
    }
    catch(error) {
        console.log(error) ;
        return res.status(500).json({
            status : false, 
            message : "Internal Server Error"
        })
    }
}) */

export default router ;