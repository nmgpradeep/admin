const router = require('express').Router();
var passport = require('passport');
require('../config/passport')(passport);
const userController= require('../controllers/userController');
router.post('/signup',userController.signup);
router.post('/login',userController.login);
//passport.authenticate('jwt', { session: false}),
router.get('/users/:page', userController.users);
router.get('/listUser', userController.listUser);
router.get('/viewUser/:id',userController.viewUser);
//router.get('/viewPage/:id',pageController.viewPage);
router.post('/updateUser',userController.updateUser);
router.post('/changeStatus',userController.changeStatus);
router.delete('/deleteUser/:id',userController.deleteUser);
router.get('/dashboardStates',userController.dashboardStates);
router.get('/viewAdmin/:id',userController.viewAdmin);
// router.put('/updateAdmin',userController.updateAdmin);

module.exports = router;
