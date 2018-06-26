var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");

router.post('/login', function(req, res) {
  console.log(res.body);
  res.send('Logon Success');
});
//var router = express.Router();
module.exports = router;
