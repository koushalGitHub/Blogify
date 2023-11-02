const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const usersRoute = require('./route/users');
const blogRoute = require('./route/blog');


const cookiePaser = require('cookie-parser');

const Blog = require("./models/blog");

const hostname = '127.0.0.1';
const port = '5000';
app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({extended:false}));   // middle ware for handeling form data

const server =http.createServer((req,resp)=>{
    resp.writeHead(200,{'Content-Type':'application\json'});
    resp.write(JSON.stringify({name:'koushal',email:'kodushal@gmail'}))
    resp.end();
});
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.resolve('./public')));   // this middle for print image on browser
// app.use(express.static(path.join(__dirname, 'public')));

// console.log(app.use(express.static(path.resolve('./public'))));

const mongoose = require('mongoose');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(()=>console.log("MongoDb Connected"));

app.use(cookiePaser());
app.use(checkForAuthenticationCookie("tokenCookie"));   // this is for our invilt function.

//middleware

app.use('/user',usersRoute);
app.use('/blog',blogRoute);



// middleware
app.get('/', async (req,res)=>{
    const allBlogs = await Blog.find({}).sort({'createdAt':-1});  // this is use for sort decending 
    res.render('home',{
        user : req.user,     
        blogs : allBlogs,  
    });
});



app.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);

})