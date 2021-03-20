//Router For Product
const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const {verifyUser} = require('../verifyToken');
const {superAdminAccess, currentUser} = require('../controller/userAccessController');


//Create a New Product
router.post('/', verifyUser, superAdminAccess, async (req, res) => {
try {
//Check if product already exist
const productExist = await Product.findOne({name: req.body.name});
if(productExist) return res.status(400).send('Product already exist'); 

//Add product
const product = new Product({
    name: req.body.name,
    price: req.body.price
});

const savedProduct = await product.save();
res.status(200).send(savedProduct);
} catch (error) {
    res.status(400).send(error);
}
});

//Read Product
router.get('/', verifyUser, currentUser, async(req, res) => {
    try {
       const data = await Product.find()
        res.send(data);
    } catch (error) {
        res.status(404).send('Not Found!');
    }
    
});

//Find Product by id
router.get('/:id', verifyUser, async(req, res) => {
    const id = req.params.id;

    try {
        const data = await Product.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('Product Not Found!');
    }
});

module.exports = router;