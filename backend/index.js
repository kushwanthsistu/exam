import express from "express"
import mongoose from "mongoose"
import router from "router"
import cors from "cors"
import path from "path"                       // 🔧 added
import { fileURLToPath } from "url"          // 🔧 added

import authentication from "./routes/Authentication.js"
import exam from "./routes/examsetting.js"
import adminRoutes from "./routes/adminroutes.js"
import studentRoute from "./routes/studentroutes.js"

const __filename = fileURLToPath(import.meta.url);  // 🔧 added
const __dirname = path.dirname(__filename);         // 🔧 added

let app = new express();

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/api/authenticate', authentication);
app.use('/api/setExam', exam);
app.use('/api/admin', adminRoutes);
app.use('/api/user', studentRoute);

// 🔧 FIXED: serve frontend folder correctly
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

// syam added
app.use(express.static('public'));
app.get('/', (req, res) => res.render('index1'));
// syam added

mongoose.connect("mongodb://127.0.0.1:27017/exam");
const db = mongoose.connection;
db.on("error", (error) => {
    console.log(error);
});
db.once("open", () => {
    console.log("successfully connected to the database");
});

app.get('/', (req, res) => {
    console.log("this route is working");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});
