const { required, func } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Products');
const {verifyUser} = require('../verifyToken');
const {superAdminAccess, adminAccess, currentUser} = require('../controller/userAccessController');

//Make an order for product
router.post('/', verifyUser, currentUser, async(req, res, next) => {
try {
  const {userId, productId} = req.body; 
  const quantity = Number.parseInt(req.body.quantity);

    //Get selected product details
  const productDetails = await Product.findById(productId);
  //console.log(productDetails.price); 

  //Save order to db
  const order = new Order({
        userId: userId,
        product: productId,
        quantity: quantity,
        price: parseInt(productDetails.price * quantity)
    });

    const savedOrder = await order.save();
    res.status(200).send(savedOrder);
    } catch (error) {
    res.status(404).send(error);
    }
});

//Admin: Get full order-list
router.get('/', verifyUser, adminAccess, async(req, res) => {
  try {
    const data = await Order.find(); 
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send('Not Found');
  }
});

//Admin: Get pending order list
router.get('/pending', verifyUser, adminAccess, async(req, res) => {
  try {
    const data = await Order.find({order_status: 'pending'});
     res.status(200).send(data);
  } catch (error) {
    res.status(400).send("Pending list not found!");
  }
});

//Super Admin: Get Order list of todays' 
//*Faced problem of casting error. solved by pasting this block befor /order-list/:id *
router.get('/today', verifyUser, superAdminAccess, async(req, res) => { 
  try {
    const currentDate = new Date();
   currentDate.setHours(0,0,0,0);

   const nextDate = new Date();
   nextDate.setHours(23,59,59,999);

   const data = await Order.find({
    date: {
      $gte: currentDate,
      $lt: nextDate
    }
   });
   const count = data.length;
   res.status(200).json({
     Total_order: count,
     data: data
   });
  } catch (error) {
    res.status(404).send('Not Found');
  }
});

//Super Admin: Get order list of a particular user by user id
router.get('/:userId', verifyUser, superAdminAccess, async(req, res) => {
  try {
  const userId = req.params.userId;
  const data = await Order.findOne({userId: userId});
      res.status(200).json({
      UserId: data.userId,
      product: data.product,
      quantity: data.quantity
    });
  } catch (error) {
    res.status(404).send('No order found!.');
  }
});

//Admin: Change Order Status
router.patch('/:orderId', verifyUser, adminAccess, async(req, res) => {
  try {
  const orderId = req.params.orderId;
  const update = req.body;

  const data = await Order.findByIdAndUpdate(orderId, update, {new: true});
  res.status(200).send(data);
  } catch (error) {
    res.status(400).send('Order not found.');
  }
});

module.exports = router;