const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

//Register a User
 router.post('/register', async (req, res) => {

    //validate before creating new a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
     
    // Check if user already exist by checking email!
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist!');

   //Hash Password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new User({
       first_name: req.body.first_name,
       last_name: req.body.last_name,
       email: req.body.email,
       password: hashedPassword
    });
 
    try {
       const savedUser = await user.save();
       res.send({user: savedUser._id});
    } catch (err) {
       res.status(400).send(err);
    }
 });

 //Login a User
 router.post('/login', async(req, res) => {
    
   //Validate User
   const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

   //Check if the email is valid
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email not found!😐');

   // Check if the password match
   const validPass = await bcrypt.compare(req.body.password, user.password);
   if(!validPass) return res.status(400).send('Invalid Password 😐');

   //Generate and Assign Access Token
   const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
   res.header('auth-token', token).send(token);
   
   //res.status(200).send('Logged In! 😁');
 });

 module.exports = router;