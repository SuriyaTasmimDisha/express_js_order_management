const express = require('express');
const router = express.Router();
const verify = require('../verifyToken');

//Get Posts
router.get('/posts', verify, (req, res) => {
  res.json({ posts: {title: 'My First Post', Description: 'Oh! Hello There.'}})
});

module.exports = router;
