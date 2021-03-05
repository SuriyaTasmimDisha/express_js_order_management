//Verify Token for Accessing different private route
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const verifyUser = (req, res, next) => {
    const token = req.cookies.user;

    //Check for Token
    if(!token) return res.status(401).send('Access Denied!');
    
    //Verify the given token
    try{
     const verified = jwt.verify(token, process.env.TOKEN_SECRET); //How process.env.TOKEN_SECRET has access in this file without getting imported
     req.user = verified;
    } catch(err){
      res.status(400).send('Invalid Token');
    }

    next();
}

//check current user
const currentUser = (req, res, next) => {
  const token = req.cookies.user;

  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, async(error, decodedToken) => {
      if(error){
        res.status(400);
        next();
      } else{
        const user = await User.findById(decodedToken._id);
        const userId = user._id;
        console.log(userId, user.role);
        next();
      }
    });
  }
}

module.exports = {verifyUser, currentUser};