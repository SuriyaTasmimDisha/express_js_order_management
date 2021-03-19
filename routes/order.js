const { required, func } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Products');
const {verifyUser} = require('../verifyToken');
const {superAdminAccess, adminAccess, currentUser} = require('../controller/userAccessController');

//Make an order for product
router.post('/add', verifyUser, currentUser, async(req, res, next) => {

  const {userId, productId} = req.body; 
  const quantity = Number.parseInt(req.body.quantity);

  try {
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
router.get('/order-list', verifyUser, adminAccess, async(req, res) => {
   await Order.find((error, data) => {
   if(error) return res.status(404).send('Not Found')
   res.status(200).send(data);
 })
});

//Admin: Get pending order list
router.get('/order-list/pending', verifyUser, adminAccess, async(req, res) => {
  await Order.find({order_status: 'pending'}, (error, data) => {
    if(error) return res.status(400).send(error);
    res.status(200).send(data);
  });
});

//Super Admin: Get Order list of todays' 
//*Faced problem of casting error. solved by pasting this block befor /order-list/:id *
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

//Super Admin: Get order list of a particular user by user id
router.get('/order-list/:id', verifyUser, superAdminAccess, async(req, res) => {
  const id = req.params.id;

  await Order.findOne({userId: id}, (error, data) => {
    if(error) return res.status(404).send('No order found!.');
    return res.status(200).json({
      UserId: data.userId,
      product: data.product,
      quantity: data.quantity
    });
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