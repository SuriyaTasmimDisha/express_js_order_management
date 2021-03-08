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
        req.body.userId = user._id;
        next();
      }
    });
  }
}

//Super Admin Access 
function superAdminAccess(req, res, next) {
    const token = req.cookies.user;

  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, async(error, decodedToken) => {
      if(error){
        res.status(400);
        next();
      } else{
        const user = await User.findById(decodedToken._id);
        if( user.role !== 'super admin' ) return res.status(403).send('Restricted Access');
      }
      next();
    });
  }
}

//Admin access
function adminAccess(req, res, next) {
    const token = req.cookies.user;

  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, async(error, decodedToken) => {
      if(error){
        res.status(400);
        next();
      } else{
        const user = await User.findById(decodedToken._id);
        if( user.role !== 'admin' ) return res.status(403).send('Restricted Access');
      }
      next();
    });
  }
}


module.exports = {verifyUser, currentUser, superAdminAccess, adminAccess};