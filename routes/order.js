const { required } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const {verifyUser, currentUser} = require('../verifyToken');

//Make an order for product
router.post('/order', verifyUser, currentUser, async(req, res, next) => {
  const token = req.cookies.user;

  if(token){
    jwt.verify(token, process.env.TOKEN_SECRET, async(error, decodedToken) => {
      if(error){
        res.status(400);
        next();
      } else{
        const user = await User.findById(decodedToken._id);
        const userId = user._id;
        const order = new Order({
        //user: '',
        product: req.body.productId,
        quantity: req.body.quantity
    });
      }
    });
  }

    try {
    const savedOrder = await order.save();
    res.status(200).send(savedOrder);
    } catch (error) {
    res.status(400).send(error);
    }
});

module.exports = router;