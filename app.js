const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"images")
    },
    filename: (req,file,cb) => {
        cb(null,new Date().toISOString() + "-" + file.originalname)
    }
})

const filter = (req,file,cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

// bodyParser.urlencoded() is for x-www-urlencoded-form <form>
app.use(bodyParser.json()) // it is for transfering application/json
app.use("/images",express.static(path.join(__dirname,"images")))

app.use(multer({storage:storage,fileFilter:filter}).single("image"))

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","OPTIONS,POST,GET,PUT,DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization")
    next();
})

app.use("/feed",feedRoutes);
app.use("/auth",authRoutes);

app.use((error,req,res,next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message, data: error.data
    });
})

mongoose.connect("mongodb://localhost:27017/messages",{ useNewUrlParser: true,useUnifiedTopology: true })
.then(res => {
    const server = app.listen(8080);
    /* websocet is over http and we explicity enable cors in second parameter */
    const io = require("./socket").init(server);
    io.on("connection", socket => {
        console.log("Client connected!");
    })
})
.catch(err => {
    err.statusCode = 500;
    next(err);
})

