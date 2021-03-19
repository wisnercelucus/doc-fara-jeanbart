const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect("mongodb+srv://wisnercelucus:Wisnercelucus92898202@cluster0.f4uog.mongodb.net/mean-course")
.then(
    () => {
        console.log("Connected to mongodb successfully");
    }
)
.catch(()=>{console.log("Connection failed!")});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-width, Content-Type, Authorization, Accept');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use('/api/accounts', usersRoutes);
app.use('/api/posts', postsRoutes);

module.exports = app;