//const bodyParser = require('body-parser')
const User = require('../models/User')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const md5 = require('md5')
//const nodemailer = require('nodemailer');
// var passport = require('passport');
// require('../config/passport')(passport);
// var getToken = function (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ');
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };
const signup = (req, res) => {

  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.firstName && !req.body.middleName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.userType) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['email', 'password', 'userType']);
  if (flag) {
    return res.json(flag);
  }
  User.findOne({ email: req.body.email }, (err, result) => {
    if (result) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      //let now = new Date();
      let unix_time = moment().unix()
      let salt = data.user_contact + unix_time
      let accessToken = md5(salt)
      req.body.accessToken = accessToken
      User.create(req.body, (err, result) => {
		  console.log('RES-FIND',err, result);
        if (err) {
          return res.send({
			errr : err,
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
          delete result.password

		  	// 	// Generate test SMTP service account from ethereal.email
				// // Only needed if you don't have a real mail account for testing
        //
				// 	// create reusable transporter object using the default SMTP transport
				// 	let transporter = nodemailer.createTransport({
				// 		host: 'ssl://email-smtp.us-west-2.amazonaws.com',
				// 		port: 587,
				// 		secure: false, // true for 465, false for other ports
				// 		auth: {
				// 			//~ user: account.user, // generated ethereal user
				// 			//~ pass: account.pass // generated ethereal password
				// 			user: "AKIAIO7ALOC42FJEP4LQ", // generated ethereal user
				// 			pass: "AqS+G6H9ECj5se4MYgdj434BEXzJ8FI4siK0B65yuqAJ" // generated ethereal password
				// 		}
				// 	});
        //
				// 	// setup email data with unicode symbols
				// 	let mailOptions = {
				// 		from: '"pitchandswitch 👻" pitchandswitch.com', // sender address
				// 		to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
				// 		subject: 'Hello ✔', // Subject line
				// 		text: 'Hello world?', // plain text body
				// 		html: '<b>Hello world?</b>' // html body
				// 	};
        //
				// 	// send mail with defined transport object
				// 	transporter.sendMail(mailOptions, (error, info) => {
				// 		if (error) {
				// 			return console.log(error);
				// 		}
				// 		console.log('Message sent: %s', info.messageId);
				// 		// Preview only available when sending through an Ethereal account
				// 		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        //
				// 		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
				// 		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
				// 	});




          return res.send({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: result
          })

        }
      })
    }
  })
}
const login = (req, res) => {
	console.log("login",req.body);
    if (!req.body.email && !req.body.password && !req.body.userType) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  console.log("body", data);
  const flag = validation.validate_all_request(data, ['email', 'password', 'userType']);
  if (flag) {
    return res.json(flag);
  }
  User.findOne({ email: req.body.email, userType: req.body.userType }, (err, result) => {
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
      } else if (result.userType === req.body.userType) {
        result.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var now = new Date();
            var unix_time = moment().unix()
            var salt = data.user_contact + unix_time
            var accessToken = md5(salt)

            var updateObj = {};
            updateObj.accessToken = accessToken;
            updateObj.deviceToken = req.body.deviceToken;
            User.findOneAndUpdate({
              _id: result._id
            }, {
                '$set': updateObj
              }, {
                new: true
              }).lean().exec(function (err, result) {
                if (err)
                  return res.send({
                    code: httpResponseCode.BAD_REQUEST,
                    message: httpResponseMessage.INTERNAL_SERVER_ERROR
                  })
                })


            return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.LOGIN_SUCCESSFULLY,
             result: result
            });

          } else {
            return res.json({
              message: httpResponseMessage.INVALID_USER_PASSWORD,
              code: httpResponseCode.BAD_REQUEST,
            });
          }
        });
      } else {
        return res.json({
          message: httpResponseMessage.INVALID_USER_PASSWORD,
          code: httpResponseCode.BAD_REQUEST,
        });
      }


    }

  })
}

const listUser = (req, res) => {
  //var token = getToken(req.headers);
  // if (token) {
    User.find({}, (err, result) => {
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

//Auther	: Rajiv Kumar Date	: June 22, 2018
//Description : Function to list the available users with pagination
  const users = (req, res) => {
    var perPage = 2
    var page = req.params.page || 1;
    User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, users) {
          User.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: users,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
    }


/** Auther	: Rajiv umar
 *  Date	: June 20, 2018
 *	Description : Function to view the available user details
 **/
const viewUser = (req, res) => {
	const id = req.params.id;
	//console.log('<<<<<<<<<<<',id);
	User.findOne({_id:id}, (err, result) => {
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
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}


/** Auther	: Rajiv umar
 *  Date	: June 18, 2018
 *	Description : Function to update the user details.
 **/
const updateUser = (req, res) => {
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
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to update the user status.
 **/
const changeStatus = (req, res) => {
  User.update({ _id:req.body._id },  { "$set": { "userStatus": req.body.userStatus } }, { new:true }, (err,result) => {
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
              message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
             result: result
            });
      }
    }
  })
}
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to delete the user
 **/
const deleteUser = (req, res) => {
	User.findByIdAndRemove(req.params.id, (err,result) => {
    if(err){
		return res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
    }
		return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });
  })
}

module.exports = {
  signup,
  login,
  listUser,
  users,
  viewUser,
  updateUser,
  changeStatus,
  deleteUser
}
