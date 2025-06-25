import express from "express"
import mongoose from "mongoose"
import router from "router"
import cors from "cors"
import authentication from "./routes/Authentication.js"
import exam from "./routes/examsetting.js"
import adminRoutes from "./routes/adminroutes.js"
import studentRoute from "./routes/studentroutes.js"

let app = new express() ;

app.use(cors()) ;
app.use(express.json())
app.set('view engine', 'ejs'); 
app.set('views', './views');
app.use('/api/authenticate', authentication) ;
app.use('/api/setExam', exam)
app.use('/api/admin', adminRoutes)
app.use('/api/user', studentRoute) ;

mongoose.connect("mongodb://127.0.0.1:27017/exam") ;
const db = mongoose.connection ;
db.on("error", (error) => {
    console.log(error) ;
})
db.once("open", () => {
    console.log("successfully connected to the database") ;
})

app.get('/', (req, res) => {
    console.log("this route is working") ;
})

app.listen(3000, () => {
    console.log("listening on port 3000") ;
})