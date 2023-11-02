const { Router } = require('express')
const router =  Router();
const User  = require('../models/users') 


router.get('/signin',(req,res)=>{
    return res.render("signin");
})
router.get('/signup',(req,res)=>{
    return res.render("signup");
})

router.post('/signup',async(req,res)=>{
    const { fullName, email , password }  = req.body;
    await User.create({
            fullName,
            email,
            password
    });
    return res.redirect("/")
});

router.post('/signinForm',async (req,res)=>{  
    const { email , password }  = req.body;
    try {
        const token = await User.matchPasswordAndGenrateToken(email,password);
    return res.cookie("tokenCookie",token).redirect('/');
    } catch (error) {
        return res.render("signin",{
            error : "Incorrect email or password",
        });
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('tokenCookie').redirect('/')
})

module.exports = router;