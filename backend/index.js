import express from "express"
import mongoose from "mongoose"
import router from "router"
import cors from "cors"
import authentication from "./routes/Authentication.js"
import exam from "./routes/examsetting.js"

let app = new express() ;

app.use(cors()) ;
app.use(express.json())
app.use('/api/authenticate', authentication) ;
app.use('/api/setexam', exam)

mongoose.connect("mongodb://127.0.0.1:27017/exam") ;
const db = mongoose.connection ;
db.on("error", (error) => {
    console.log(error) ;
})
db.once("open", () => {
    console.log("successfully connected to the database") ;
})

app.listen(3000, () => {
    console.log("listening on port 3000") ;
})