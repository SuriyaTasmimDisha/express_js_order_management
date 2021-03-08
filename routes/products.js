//Router For Product
const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const {verifyUser, superAdminAccess, currentUser} = require('../verifyToken');


//Create a New Product
router.post('/add', verifyUser, superAdminAccess, async (req, res) => {

//Check if product already exist
const productExist = await Product.findOne({name: req.body.name});
if(productExist) return res.status(400).send('Product already exist'); 

//Add product
const product = new Product({
    name: req.body.name,
    price: req.body.price
});
try {
    const savedProduct = await product.save();
    res.status(200).send(savedProduct);
} catch (error) {
    res.status(400).send(error);
}
});

//Read Product
router.get('/product-list', verifyUser, currentUser, async(req, res) => {
    await Product.find((error, data) => {
        if(error) return res.status(404).send('Not Found!');
        res.send(data);
    });
});

//Find Product by id
router.get('/:id', verifyUser, async(req, res) => {
    const id = req.params.id;
    Product.findById(id, (error, data) => {
        if(error) return res.send(error);
        res.status(200).send(data);
    });
});

module.exports = router;