const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const {verifyUser} = require('../verifyToken');
const {superAdminAccess} = require('../controller/userAccessController');

//Register a User
 router.post('/registration', async (req, res) => {
try {
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
       password: hashedPassword,
       role: req.body.role
    });

       const savedUser = await user.save();
       res.send({user: savedUser._id});
    } catch (error) {
       res.status(400).send('Sorry! Bad Request.');
    }
 });


 //Login a User
 router.post('/login', async(req, res) => {
   try {
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
   const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '60m'}); //Expires after 50mins
   res.cookie('user', token, {httpOnly: true, maxAge: 50 * 60 * 1000});
   
   res.status(200).send('Logged In! 😁');
   } catch (error) {
     res.status(400).send('Sorry! Bad Request.');
   } 
 });

//Logout a user
router.get('/logout', (req, res) => {
   try {
   res.cookie('user', '', {maxAge: 1});
   res.status(200).send('You have been logged out!');
   } catch (error) {
       res.status(400).send("Sorry! Couldn't Process Request.");
   }
});

 //Get List of Registered Users
 router.get('/', verifyUser, superAdminAccess, async(req, res) => {
    try {
       const data = await User.find();
       res.status(200).send(data);
    } catch (error) {
       res.status(404).send('Not found!');
    }
   });

 //Find a user by ID
 router.get('/:id', verifyUser, superAdminAccess, async(req, res) => {
   try {
   const id = req.params.id;
   const data = await User.findById(id);
   res.status(200).send(data);
   } catch (error) {
   res.status(404).send('User Info Not Found!')   
   }
 });


 //Update Info of a Current User
router.patch('/:id', verifyUser, superAdminAccess, async(req, res) => {
   try {
   const id = req.params.id;
   const password = req.body.password;

   //hash password
   const salt = await bcrypt.genSalt(10);
   req.body.password = await bcrypt.hash(password, salt);   

   const result = await User.findOneAndUpdate(id, req.body, {new: true});
   res.send(result);
   } catch (error) {
      res.status(400).send(error);
   }
});


//Delete User from Database
router.delete('/:id', verifyUser, superAdminAccess, async(req, res) => {
   try {
      const id = req.params.id;
      const deleteUser = await User.findByIdAndDelete(id, (err) => {
         if(err){
            res.status(404).send('User not found!')
         } else{
            res.status(200).send('User removed successfully!');
         }
      })
   } catch (error) {
            res.status(400).send(error);
   }
});

 
 module.exports = router;