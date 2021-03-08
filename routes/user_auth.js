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
       password: hashedPassword,
       role: req.body.role
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
   const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: '50m'}); //Expires after 50mins
   res.cookie('user', token, {httpOnly: true, maxAge: 50 * 60 * 1000});
   
   res.status(200).send('Logged In! 😁');
 });

//Logout a user
router.get('/logout', (req, res) => {
   res.cookie('user', '', {maxAge: 1});
   res.status(200).send('You have been logged out!');
});

 //Get List of Registered Users
 router.get('/user-list', verifyUser, superAdminAccess, async(req, res) => {
   await User.find((err, data) => {
      if(err) return res.status(404).send('Not found!');
      res.send(data);
   });
 });


 //Find a user by ID
 router.get('/:id', verifyUser, superAdminAccess, async(req, res) => {
   const id = req.params.id;
   await User.findById(id, (err, user) => {
      if(err){
         res.status(404).send('User Info Not Found!')
      } else{
         res.status(200).send(user);
      }
   });
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