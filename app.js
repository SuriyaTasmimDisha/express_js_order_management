const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

dotenv.config();
const mongoDB = process.env.DB_CONNECT;

//Connect To MongoDB
mongoose.connect(mongoDB, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false 
}, () => {
  console.log("Connected to DB");
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Import Routes
const user_authRouter = require('./routes/user_auth');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/order');
const generateProductRouter = require('./routes/generate_product');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route Middlewares
app.use('/api/users', user_authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', generateProductRouter);

module.exports = app;
