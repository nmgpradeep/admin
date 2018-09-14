const router = require('express').Router();
var passport = require('passport');
var express = require('express');
var jwt = require('jsonwebtoken');
require('../config/passport')(passport);
passport.authenticate('jwt', { session: false});
const productController= require('../controllers/productController');
router.get('/search-listing/:id',productController.searchListing);
module.exports = router;
