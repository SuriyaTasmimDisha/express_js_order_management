const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const {verifyUser, superAdminAccess, adminAccess, currentUser} = require('../verifyToken');