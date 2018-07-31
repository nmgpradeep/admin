const router = require('express').Router();
var passport = require('passport');
var express = require('express');
var jwt = require('jsonwebtoken');
require('../config/passport')(passport);
passport.authenticate('jwt', { session: false});
const userController= require('../controllers/userController');
router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/users/:page', userController.users);
router.get('/listUser', userController.listUser);
router.get('/viewUser/:id',userController.viewUser);
//router.get('/viewPage/:id',pageController.viewPage);
router.post('/updateUser',userController.updateUser);
router.post('/changeStatus',userController.changeStatus);
router.delete('/deleteUser/:id',userController.deleteUser);
router.get('/dashboardStates',userController.dashboardStates);
router.get('/viewAdmin/:id',userController.viewAdmin);
router.get('/getLoggedInUser',userController.getLoggedInUser);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/resetPassword/:id', userController.resetPassword)
// router.put('/updateAdmin',userController.updateAdmin);

module.exports = router;
