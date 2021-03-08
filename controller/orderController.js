const Product = require('../models/Products');


const getPrice = (req, res, next) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  Product.findById(productId).
          exec((error, data) => {
            if(error) return res.status(400).send(error);
            const price = (data.price)*quantity;
            req.body.price = price;
            console.log(price);
             next();
          });
}

module.exports = {getPrice};