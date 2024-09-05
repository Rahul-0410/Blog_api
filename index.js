const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app=express();
const bcrypt = require('bcrypt');
const User= require('./model/user');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser'); 

// to pass cookie in react set credentials to include
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


const salt=bcrypt.genSaltSync(10);

//for jwt
const secret= 'yugdweud2378e2387eh2';

mongoose.connect('mongodb://localhost:27017/auth',{
    
});


app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
        const UserDoc= await User.create({username,
            password:bcrypt.hashSync(password,salt)});
        res.json(UserDoc);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})
app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    const userDoc= await User.findOne({username})
   const passOk= bcrypt.compareSync(password,userDoc.password);
    // res.json(passOk);
    if(passOk){
        //logged in
        jwt.sign({username,id:userDoc._id}, secret, {},(err,token)=>{
                if(err){
                    res.status(400).json({message:'login failed'});
                }
                res.cookie('token',token).json('ok');
        })
    } else{
        res.status(400).json({message:'login failed'});
    }
})

app.get('/profile',(req,res)=>{
     const {token}=req.cookies;
        jwt.verify(token,secret,{},(err,decoded)=>{
            if(err){
                res.status(400).json({message:'not logged in'});
            }
            res.json(decoded);
        })
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

app.listen(4000);