const express = require('express');
const router = express.Router();
const {verifyUser} = require('../verifyToken');

//Get Posts
router.get('/posts', verifyUser, (req, res) => {
  res.json({ posts: {title: 'My First Post', Description: 'Oh! Hello There.'}})
});

module.exports = router;
