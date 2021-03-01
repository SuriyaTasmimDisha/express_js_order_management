var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://admin-Disha:Test123@cluster0.gsetk.mongodb.net/order_management?retryWrites=true&w=majority";

//Connect To MongoDB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log("Connected to DB");
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var helloRouter = require('./routes/hello');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', helloRouter);

module.exports = app;
