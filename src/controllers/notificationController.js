//const bodyParser = require('body-parser')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');
var NodeSession = require('node-session');
session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to emailNotification available of user 
 ***/
const emailNotification = (req, res) => {
  //var token = getToken(req.headers);
  // if (token) {
	//var value = req.session.get('user');
    User.findOne({userType:1,email:'admin@admin.com'}, (err, result) => {
      if (err) {
        return res.send({
          code: httpResponseCode.BAD_REQUEST,
          message: httpResponseMessage.INTERNAL_SERVER_ERROR
        })
      } else {
        if (!result) {
          res.json({
            message: httpResponseMessage.USER_NOT_FOUND,
            code: httpResponseMessage.BAD_REQUEST
          });
        }else {
          return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.LOGIN_SUCCESSFULLY,
               result: result
              });

        }
      }
    });
  // } else {
  //   return res.status(403).send({code: 403, message: 'Unauthorized.'});
  // }
}

/** Auther	: Rajiv umar
 *  Date	: July 23, 2018
 *	Description : Function to update the notification details.
 **/
const emailNotificationUpdate = (req, res) => {
  User.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      }else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}

module.exports = {
	emailNotification,
	emailNotificationUpdate
}
