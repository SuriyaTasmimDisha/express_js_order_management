const { required } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const {verifyUser, superAdminAccess, adminAccess} = require('../verifyToken');

//Make an order for product
router.post('/add', verifyUser, async(req, res) => {
        const order = new Order({
        //user: '',
        product: req.body.productId,
        quantity: req.body.quantity
        // date: new Date
    });

    try {
    const savedOrder = await order.save();
    res.status(200).send(savedOrder);
    } catch (error) {
    res.status(400).send('Something went wrong!');
    }
});

//Get full order-list
router.get('/order-list', verifyUser, superAdminAccess, adminAccess, async(req, res) => {
   await Order.find((error, data) => {
   if(error) return res.status(404).send('Not Found')
   res.status(200).send(data);
 })
});

//Super Admin: Get Order list of todays'
router.get('/order-list/today', verifyUser, superAdminAccess, async(req, res) => { 
   const currentDate = new Date();
   currentDate.setHours(0,0,0,0);

   const nextDate = new Date();
   nextDate.setHours(23,59,59,999);

   await Order.find({
    date: {
      $gte: currentDate,
      $lt: nextDate
    }
   },
   (error, data) => {
   const count = data.length;
   if(error) return res.status(404).send('Not Found')
   res.status(200).json({
     Total_order: count,
     data: data
   });
 })
});

//Admin: Get pending order list
router.get('/pending', verifyUser, adminAccess, async(req, res) => {
  await Order.findOne({order_status: 'pending'}, (error, data) => {
    if(error) return res.status(400).send(error);
    res.status(200).send(data);
  });
});

//Admin: Change Order Status
router.patch('/:id', verifyUser, adminAccess, async(req, res) => {
  const id = req.params.id;
  const update = req.body;

  await Order.findByIdAndUpdate(id, update, {new: true}, (error, data) => {
    if(error) return res.status(400).send(error);
    res.status(200).send(data);
  });
});

module.exports = router;