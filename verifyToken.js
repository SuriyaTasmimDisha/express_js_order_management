//Verify Token for Accessing different private route
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const verifyUser = (req, res, next) => {
    const token = req.cookies.user;

    //Check for Token
    if(!token) return res.status(401).send('You have been logged out.');
    
    //Verify the given token
    try{
     const verified = jwt.verify(token, process.env.TOKEN_SECRET); //How process.env.TOKEN_SECRET has access in this file without getting imported
     req.user = verified;
    } catch(err){
      res.status(400).send('Invalid Token');
    }

    next();
}


module.exports = {verifyUser};