const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require("nodemailer");
require('dotenv').config();


const app = express();


const urlSting = process.env.DBURL;

mongoose.connect(urlSting, {
    useNewUrlParser: true,   
    useUnifiedTopology: true, 
}); 
const db = mongoose.connection;
db.once("open",function(){
    console.log("DB connected successfully")
})

app.use(bodyParser.json());
app.use(cors());


var visitorRouter = require('./routes/visitorRouter');
var studentRouter = require("./routes/studentsRouter");
var facultyRouter = require("./routes/facultyRouter");
var studentDataBaseRouter = require("./routes/studentDataBaseRouter")
var dashboardRouter = require('./routes/dashboardRouter')
var facultyDataBaseRouter = require('./routes/facultyDataBaseRouter')
var messageRouter = require('./routes/messageRouter');
var loginRouter = require('./routes/loginRoute')

app.use('/api' , visitorRouter);
app.use('/api' , studentRouter);
app.use('/api' , facultyRouter)
app.use('/api', studentDataBaseRouter)
app.use('/api', dashboardRouter)
app.use('/api' , facultyDataBaseRouter)
app.use('/api', messageRouter);
app.use('/api', loginRouter);


const port = process.env.PORT;
app.listen(port , function(){
  console.log('Server is Running at  '+'http://localhost:'+ port);
})



app.get("/", function(req,res){
  res.send("Server is Running successfully");
});