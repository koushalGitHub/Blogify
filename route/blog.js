const express = require('express');

const router = express.Router();
const multer = require('multer');
const path = require("path");

const Blog = require('../models/blog');
const Comment = require('../models/comments');

// for store image with multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {   /// cb = call back
    //   cb(null, path.resolve(`./public/upload/${req.user._id}`));   // file create ever user separate in uplaod folder
      cb(null, path.resolve(`./public/images/uploads/`));   // file create ever user separate in uplaod folder
    },
    filename: function (req, file, cb) {
     const filename = `${Date.now()}-${(file.originalname)}`;
     cb(null,filename);
    }
  })
  
  const upload = multer({ storage: storage })   // now we can use upload in any function for upload file

router.get('/add-new',(req,res)=>{
    // console.log(req.user);return
    return res.render('addBlog',{
        user : req.user,       
    });
});
router.post('/insertBlog',upload.single("coverImage"), async (req,res)=>{
    const { title, body }  = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL: `/images/uploads/${req.file.filename}`
    })
    return res.redirect(`/`);
    
});

router.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    // console.log(blog);
    const comment = await Comment.find({blogId:req.params.id}).populate("createdBy");
    // console.log(comment)
    return res.render('blog',{
        user:req.user,
        blog:blog,
        comment:comment
    })
})

router.post('/comment/:blogId',async (req,res)=>{
    // console.log(req.body.content);
    await Comment.create({
           content: req.body.comment,
            blogId: req.params.blogId,
            createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;