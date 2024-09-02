const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app=express();
const User= require('./model/user');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/auth',{
    
});


app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
        const UserDoc= await User.create({username,password});
        res.json(UserDoc);
    }catch(err){
        res.status(400).json({message:err.message});
    }
})

app.listen(4000);