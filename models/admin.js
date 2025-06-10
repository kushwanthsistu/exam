import express from "express"
import mongoose, { mongo } from "mongoose"

let adminSchema = new mongoose.Schema({
    emailId : {
        type : String,
        required : true
    },
    password : {
        type : String, 
        required : true
    }
},
{
    timestamps : true 
})

let Admin = mongoose.model("Admin", adminSchema)

export default Admin ;