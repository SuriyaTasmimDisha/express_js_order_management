const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

dotenv.config();
const mongoDB = process.env.DB_CONNECT;

//Connect To MongoDB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log("Connected to DB");
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Import Routes
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route Middlewares
app.use('/api/user', authRouter)
app.use('/api/user', postRouter);


module.exports = app;
