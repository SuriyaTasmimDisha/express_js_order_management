//Verify Token for Accessing different private route
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');

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