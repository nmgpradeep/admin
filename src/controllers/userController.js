//const bodyParser = require('body-parser')
const User = require('../models/User')
const Product = require('../models/product')
const Donation = require('../models/donation')
const Trade = require('../models/trade')
const FlagUser = require('../models/flagUser')
const UserTradeRating = require('../models/userTradeRating')
const WishList = require('../models/wishList')
const Notification = require('../models/notification')
const UserSubscription = require('../models/userSubscription')
const UserSubscriptionAddon = require('../models/userSubscriptionAddons')
const Subscription = require('../models/subscription')
const OfferTrade =  require('../models/offerTrade')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const commonFunction = require("../../common/commonFunction");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm'); //GraphicsMagick for node.js
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var settings = require('../config/settings'); // get settings file
//var NodeSession = require('node-session');
//session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

//Where can search by Postal Address, landmark or IP Address:
var where = require('node-where');

//Get your ip address, compare ip addresses, validate ip addresses, etc.
var ip = require('ip');

// Example retrieve IP from request
var satelize = require('satelize');

var bcrypt = require('bcrypt-nodejs');
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length) {
      return parted[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
	host: constant.SMTP_HOST,
	port: constant.SMTP_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
		user: constant.SMTP_USERNAME, // generated ethereal user
		pass: constant.SMTP_PASSWORD // generated ethereal password
	}
});
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to create a new user
 **/
const signup = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
      User.findOne({ email: data.email }, (err, result) => {
    if (result) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      let unix_time = moment().unix()
      let salt = data.user_contact + unix_time
      let accessToken = md5(salt)
      req.body.accessToken = accessToken
      User.create(data, (err, result) => {
      if (err) {
          return res.send({
			errr : err,
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
			 if ((files.profilePic) && files.profilePic.length > 0 && files.profilePic != '') {
					var fileName = files.profilePic[0].originalFilename;
					var ext = path.extname(fileName);
					var newfilename = files.profilePic[0].fieldName + '-' + Date.now() + ext;
					fs.readFile(files.profilePic[0].path, function(err, fileData) {
					  if (err) {
							//console.log("err readFile",err)
							//return;
					  }
					  fileName = files.profilePic[0].originalFilename;
					  ext = path.extname(fileName);
					  newfilename = newfilename;
					  pathNew = constant.profileimage_path + newfilename;
					  fs.writeFile(pathNew, fileData, function(err) {
						if (err) {
						 // res.send(err);
						  //return;
						  console.log("err writeFile",err)
						}

					  });
					});

					User.update({ _id:result._id },  { "$set": { "profilePic": newfilename } }, { new:true }, (err,fileupdate) => {
					if(err){
						return res.json({
							code: httpResponseCode.BAD_REQUEST,
							message: httpResponseMessage.FILE_UPLOAD_ERROR
						});
					}
				   })

				}

				//Save data in notification collection to send notification to the admin
				//console.log("notification_type",constant.notification_type)
				var notification = new Notification({ notificationTypeId:1,fromUserId:result._id,toUserId:1});
				notification.save(function (err) {
				if(err){
					return res.json({
					  code: httpResponseCode.BAD_REQUEST,
					  message: httpResponseMessage.NOTIFICATION_ERROR
					});
				  }
				});

			  ///end file update///
			 // get latitude,longitude of user and save into collection
			   // console.log(data.address);
			    //~ where.is(data.address[0], function(err, responceData) {
				  //~ if(err){
						//~ return res.json({
							//~ code: httpResponseCode.BAD_REQUEST,
							//~ message: err
						//~ });
					//~ }
				  //~ if(!err) {
					//~ User.update({ _id:result._id },  { "$set": { "latitude": responceData.get('lat'),"longitude":      responceData.get('lng') } }, { new:true }, (err,latlog) => {
						//~ if(err){
							//~ return res.json({
							//~ code: httpResponseCode.BAD_REQUEST,
							//~ message: httpResponseMessage.FILE_UPLOAD_ERROR
						  //~ });
						//~ }
					  //~ })
				   //~ }
				//~ });


			    delete result.password
			  	// Generate test SMTP service account from ethereal.email
				  // Only needed if you don't have a real mail account for testing
					host=req.get('host');
					link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
					// setup email data with unicode symbols

          readHTMLFile('src/views/emailTemplate/emailWithPDF.html', function(err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                   link:link,
                   userName:result.userName.toUpperCase()
              };
              var htmlToSend = template(replacements);
              let mailOptions = {
                from: constant.SMTP_FROM_EMAIL, // sender address
                to: result.email+',rajiv.kumar@nmgtechnologies.com', // list of receivers
                subject: 'Please confirm your Email account ✔', // Subject line
                text: 'Hello world?', // plain text body
                html : htmlToSend
              };
              transporter.sendMail(mailOptions, function (error, response) {
                  if (error) {
                      console.log(error);
                  }else{
                    console.log('Message sent: %s', info.messageId);
        						// Preview only available when sending through an Ethereal account
        						//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                  }
              });
          })
					return res.json({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					})

        }
      }) // End Create user function block
    }
  })//end find user by email
})// end form.parse
}

/** Auther	: Rajiv Kumar
 *  Date	: Aug 18, 2018
 *	Description : Function to store user data signup from front
 **/
const userSignup = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
	  //console.log(data)
  User.findOne({ email: data.email }, (err, result) => {
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
	  data.loc = [data.latitude[0], data.longitude[0]];
	  data.loct = {};
	  data.loct.coordinates = [...data.loc];
	  data.loct.type = "Point";
	  console.log(data);
      User.create(data, (err, result) => {
		//  console.log('RES-FIND',err, result);
      if (err) {
          return res.send({
			         errr : err,
               code: httpResponseCode.BAD_REQUEST,
               message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
			 // check Profile Pic and upload if exist
			 if ((files.profilePic) && files.profilePic.length > 0 && files.profilePic != '') {
					var fileName = files.profilePic[0].originalFilename;
					var ext = path.extname(fileName);
					var newfilename = files.profilePic[0].fieldName + '-' + Date.now() + ext;
					fs.readFile(files.profilePic[0].path, function(err, fileData) {
					  if (err) {
						res.send(err);
						return;
					  }
					  fileName = files.profilePic[0].originalFilename;
					  ext = path.extname(fileName);
					  newfilename = newfilename;
					  pathNew = constant.profileimage_path + newfilename;
					  //return res.json(process.cwd());
					  fs.writeFile(pathNew, fileData, function(err) {
						if (err) {
						  res.send(err);
						  return;
						}

					  });
					});

					User.update({ _id:result._id },  { "$set": { "profilePic": newfilename } }, { new:true }, (err,fileupdate) => {
					if(err){
						return res.json({
							code: httpResponseCode.BAD_REQUEST,
							message: httpResponseMessage.FILE_UPLOAD_ERROR
						});
					}
				   })
				}
				//Save data in notification collection to send notification to the admin
				//console.log("notification_type",constant.notification_type)
				var notification = new Notification({ notificationTypeId:1,fromUserId:result._id,toUserId:1});
				notification.save(function (err) {
				if(err){
					return res.json({
					  code: httpResponseCode.BAD_REQUEST,
					  message: httpResponseMessage.NOTIFICATION_ERROR
					});
				  }
				});
			  ///end file update///
			    delete result.password

			  	// Generate test SMTP service account from ethereal.email
				  // Only needed if you don't have a real mail account for testing

					host=req.get('host');
					link=constant.PUBLIC_URL+"verifyUserEmail/"+result._id;
        readHTMLFile('src/views/emailTemplate/emailWithPDF.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                 link:link,
                 userName:result.userName.toUpperCase()
            };
            var htmlToSend = template(replacements);


					// setup email data with unicode symbols
					let mailOptions = {
						from: constant.SMTP_FROM_EMAIL, // sender address
						to: result.email+',rajiv.kumar@nmgtechnologies.com', // list of receivers
						subject: 'Please confirm your Email account ✔', // Subject line
						text: 'Hello world?', // plain text body
						html : htmlToSend
					};
					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						// Preview only available when sending through an Ethereal account
					//	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

						// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
						// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
					});
        });
          return res.json({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: result
          })

        }
      })
    }
  })
})
}
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to verify user and login
 **/
const login = (req, res) => {
	console.log("login",req.body);
    if (!req.body.email && !req.body.password) {
		return res.json({
		  code: httpResponseCode.BAD_REQUEST,
		  message: httpResponseMessage.REQUIRED_DATA
		})
	}
  const data = req.body;
  const flag = validation.validate_all_request(data, ['email', 'password', 'userType']);
  if(flag) {
	// console.log("flag",flag)
    return res.json(flag);
  }
  User.findOne({ email: req.body.email, userType: req.body.userType}, (err, result) => {
	  console.log('result',result);
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
        if(result.emailVerified === '0'  && result.userType === '0'){
          return res.json({
            message: httpResponseMessage.USER_EMAIL_NOT_VERIFIED,
            code: httpResponseCode.FORBIDDEN,
          });
          return;
        }


          if(result.userStatus === '0' && result.userType === 0){
            return res.json({
              message: httpResponseMessage.INACTIVE_USER,
              code: httpResponseCode.FORBIDDEN,
            });
            return;
          }


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



          // set the use data in to session
             req.session.user = result;
            // console.log("LOgin SESSION ", req.session)
              req.session.reload(function () {
				            req.session.save(function (err) {
        				      if (err) return res.end(err.message)
        				            res.end('saved')
        				      })
			       })



			//////////////////// JWT Token   ///////////////////
			// if user is found and password is right create a token
           var token = jwt.sign(result.toJSON(), settings.secret);
          // return the information including token as JSON

            return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.LOGIN_SUCCESSFULLY,
              result: result,
              token:token
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
/*
  *Auther : Saurabh Agarwal
  *Date   : July 26, 2018
  *Description  : Function to operate Forget Password
*/
const forgotPassword = (req,res) => {
 const data = req.body;
 //console.log("req.body",req.body)
 const flag = validation.validate_all_request(data, ['email']);
 if (flag) {
	return res.json(flag);
 }
  User.findOne({ email: req.body.email, userType: req.body.userType }, (err,result)=> {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          code: httpResponseCode.BAD_REQUEST,
          message: httpResponseMessage.USER_NOT_FOUND
        });
      } else {
        let transporter = nodemailer.createTransport({
          host: constant.SMTP_HOST,
          port: constant.SMTP_PORT,
          secure: false, // true for 465, false for other ports
          auth: {
            user: constant.SMTP_USERNAME, // generated ethereal user
            pass: constant.SMTP_PASSWORD // generated ethereal password
          }
        });
         link = constant.PUBLIC_URL + "#/resetPassword/"+result._id;
        const output =` <table width="100%" cellpadding="0" cellspacing="0" align="center" style="background-color: #efefef;">
            <tr>
                <td style="text-align:center">
                    <table width="600" cellpadding="0" cellspacing="0" align="center"  style="text-align:left">
                        <tr>
                            <td>
                            <img src="%PUBLIC_URL%/emailer-header.png" alt="PitchAndSwitch" style="display:block;" />
                            </td>
                        </tr>
                        <tr>
						<td style="padding:40px; background-color: #ffffff;">
						<table width="100%" cellpadding="0" cellspacing="0">
						<tr>
						<td style="padding:0 0 36px">
						<h3 style="color: #d0a518;font-size: 22px;font-weight: 400; font-family: Arial; margin: 0; padding:0">Hello `+result.userName.toUpperCase()+`,</h3>
						</td>
						</tr>
						<tr>
						<td style="padding:0 0 36px">
						<p style="color: #414141;font-size: 18px;font-weight: 400; font-family: Arial; margin: 0; padding:0">A request to reset your Pitch and Switch password has been made. If you did not make this request, simply ignore this email. If you did make this request, please reset your password:</p>
						</td>
						</tr>
						<tr>
						<td style="padding:0 0 34px">
						<a href="`+link+`"><img src="%PUBLIC_URL%/reset-button.png" alt="Reset Password" /></a>
						</td>
						</tr>
						<tr>
						<td style="padding:0 0 55px">

						<p style="color: #414141;font-size: 18px;font-weight: 400; font-family: Arial; margin: 0; padding:0">Thank you,<br/> Team Pitch and Switch</p>
						</td>
						</tr>
						<tr>
						<td style="padding:0">
						<p style="color: #969696; font-family: Arial; font-size: 13px;font-weight: 400; padding: 0; margin: 0"> If the button above does not work, try copying and pasting the URL into your browser. If you continue to have problems, please feel free to contact us at Pitch and Switch support team.</p>

						</td>
						</tr>
						</table>
						</td>
                        </tr>
                        <tr>
                            <td style="padding:30px 0; text-align: center">
                                <p style="color: #414141;font-size: 14px;font-weight: 400; font-family:Arial">Copyright &copy; 2018, All rights reserved by <a href="#" style="color: #d0a518; text-decoration: none">Pitch and Switch</a></p>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;

        host=req.get('host');
        let mailOptions = {
          from: constant.SMTP_FROM_EMAIL, // sender address
          to: req.body.email, // list of receivers
          subject: 'Forgot Password ✔', // Subject line
          text: 'Hello world?', // plain text body
          html : output
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          //console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          //res.render('ResetPassword')
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
        return res.json({
          code: httpResponseCode.EVERYTHING_IS_OK,
          message: "Reset Password link has been sent successfully to your email, Please Check Your Mail To Reset Password",
          result: result
        })
      }
  }
})
}

/**
 * Auther : Saurabh Agarwal
 * Date   : July 27, 2018
 * Description  : Function to reset Password
 */
const resetPassword = (req,res) => {
  User.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, (err,result)=> {
    if(err){
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    }else if(!result){
      res.json({
        message: httpResponseMessage.USER_NOT_FOUND,
        code: httpResponseMessage.BAD_REQUEST
      });
    } else {
      return res.json({
        code: httpResponseCode.EVERYTHING_IS_OK,
        message: httpResponseMessage.SUCCESSFULLY_DONE,
       result: result
      });

    }
  })
}


/** Auther	: Rajiv Kumar
 *  Date	: July 31, 2018
 *	Description : Function to update the user password.
 **/
const updateNewPassword = (req, res) => {
	//console.log("req.body.password",req.body.password)
	bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(req.body.password, salt, null, function (err, hash) {
                if (err) {
                    return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.INTERNAL_SERVER_ERROR
				})
                }
                //console.log("req.body.password.hash",hash)
                User.findOneAndUpdate({
				   _id: req.body._id
				}, {
					'$set': { "password": hash }
				  }, {
					new: true
				  }).lean().exec(function (err, result) {

					if (err){
					  return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.INTERNAL_SERVER_ERROR
					  })
					}else{
						 return res.json({
						  code: httpResponseCode.EVERYTHING_IS_OK,
						  message: httpResponseMessage.PASSWORD_CHANGE_SUCCESSFULLY,
						  result: result
						});
					}

				 })
			});
		});

}

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to list the available user on the plateform
 **/
const listUser = (req, res) => {
  var token = getToken(req.headers);
  if (token) {
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded.id;
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
   } else {
     return res.status(403).send({code: 403, message: 'Unauthorized.'});
   }
}
/** Auther	: KS
 *  Date	: September 23, 2018
 *	Description : Function to list the available user on the plateform
 **/
const activeUser = (req, res) => {
	 User.find({userStatus:1})
	    .exec(function(err,result){
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
			} else {
			 return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				result: result
			  });
			}
		 }
	 });
}

//Auther	: Rajiv Kumar Date	: June 22, 2018
//Description : Function to list the available users with pagination

 const users = (req, res) => {
	const options = { sort: { firstName: -1 }, limit: 10, skip: 0 }

	var token = getToken(req.headers);
		if (token) {
		var perPage = constant.PER_PAGE_RECORD
		var page = req.params.page || 1;

		User.aggregate([{
		  $lookup :{
			from: 'userSubscription',
			localField: '_id',
			foreignField: 'userId',
			as: 'subscriptionPlan'
		  }},
		  {
			$lookup: {
				from: "flagUser",
				localField: "flagTo",
				foreignField: "_id",
				as: "userFlag"
			}
		},
		 { $sort: { firstName:-1} }

		])
		  //User.find({ userType: { $ne: 1 }})
		  //.sort({createdAt:-1})

		  .skip((perPage * page) - perPage)
		  .limit(perPage)
		  //.sort('-firstName'})
		  .sort({createdAt:-1})
		  //.populate({ path: "subscriptionPlan", model: "Subscription"})
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
	} else {
			  return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}

//Auther	: KS Date	: August 28, 2018
//Description : Function to list the available users with pagination
 const sortingUsers = (req, res) => {
	 var form = new multiparty.Form();
	   form.parse(req, function(err, data, files) {
		var sortObject = {};
		var stype = data.key[0];
		var sdir = data.type[0];
		if(sdir ==1){  var sortingTy = -1; }
		else var sortingTy = 1;
		//console.log('ddddddddd',sortByFields);
	    var token = getToken(req.headers);
		if (token) {
		var perPage = constant.PER_PAGE_RECORD
		var page = req.params.page || 1;

		sortObject[stype] = sortingTy;
		User.aggregate([{
		  $lookup :{
				from: 'userSubscription',
				localField: '_id',
				foreignField: 'userId',
				as: 'subscriptionPlan'
		   }},
		  {
			$lookup: {
				from: "flagUser",
				localField: "flagTo",
				foreignField: "_id",
				as: "userFlag"
		 	  }
		   },
		   //{ $sort: { sortByFields:sortingTy} }
		 ])
		  .sort(sortObject)
		  //.sort({sortByFields: type})
		  //.skip((perPage * page) - perPage)
		  .limit(perPage)
		  .exec(function(err, users) {
			 // console.log('results',users);
			  User.count().exec(function(err, count) {
				if (err) return next(err)
				  return res.json({
					  code: httpResponseCode.EVERYTHING_IS_OK,
					  message: httpResponseMessage.SUCCESSFULLY_DONE,
					  result: users,
					  total : count,
					  current: data.page,
					  perPage: perPage,
					  sortType: sortingTy,
					  pages: Math.ceil(count / perPage)
				  });
				})
			});
	} else {
		return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
  });
}


/** Auther	: Rajiv umar
 *  Date	: June 20, 2018
 *	Description : Function to view the available user details
 **/
const viewUser = (req, res) => {
   const id = req.params.id;
	     User.findById({_id:id})
		.populate('city')
		.populate('city',['cityName'])
		.populate('state',['stateName'])
		.populate('country',['countryName'])
	     .exec(function(err, result){
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
			} else {
				return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				result: result
				});
			   }
			}
	   });
}
/** Auther	: karnika sharma
 *  Date	: July 6, 2018
 *	Description : Function to view the available user details
 **/
const myProfle = (req, res) => {
	//User.findOne({_id: userId}).then(function(user){
var token = getToken(req.headers);
   if (token) {
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
			User.find({_id:userId})
			.populate('city')
			.populate('state')
			.populate('country')
			.exec(function (err, result){
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
			  } else {
				return res.json({
					code: httpResponseCode.EVERYTHING_IS_OK,
					message: httpResponseMessage.SUCCESSFULLY_DONE,
					result: result
				});
			  }
			}
		})
	} else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}


/** Auther	: Rajiv umar
 *  Date	: June 18, 2018
 *	Description : Function to update the user details.
 **/
const updateUser = (req, res) => {
  var form = new multiparty.Form();
	form.parse(req, function(err, data, files) {
	let now = new Date();
    User.findOneAndUpdate({ _id:data._id }, data,(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }  else {
		  if (!result) {
			res.json({
			  message: httpResponseMessage.USER_NOT_FOUND,
			  code: httpResponseMessage.BAD_REQUEST
			});
		  } else {

			 if ((files.profilePic) && files.profilePic.length > 0 && files.profilePic != '') {
				var fileName = files.profilePic[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.profilePic[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.profilePic[0].path, function(err, fileData) {
				  if (err) {
					//res.send(err);
					//return;
					console.log("readFile err",err)
				  }
				  fileName = files.profilePic[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.profileimage_path + newfilename;
					//console.log("pathNew",pathNew)
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  //~ res.send(err);
					  //~ return;
					  console.log("writeFile err",err)
					}
				  });
				});

			  User.update({ _id:data._id },  { "$set": { "profilePic": newfilename } }, { new:true }, (err,fileupdate) => {
				if(err){
					return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.FILE_UPLOAD_ERROR
					});
				} else {
					result.profilePic = newfilename;
					return res.send({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					});
				  }

			   })
            }
            else {
			   return res.json({
				  code: httpResponseCode.EVERYTHING_IS_OK,
				  message: httpResponseMessage.SUCCESSFULLY_DONE,
				 result: result
               });
			}
         }
        }
      })
  });
}
/** Auther	: Karnika sharma
 *  Date	: July 6, 2018
 *	Description : Function to update the admin profile.
 **/
const updateAdmin = (req, res) => {
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
 *	Description : Function to update the user status.
 **/
const searchCity = (req, res) => {
	var form = new multiparty.Form();
	  form.parse(req, function(err, data, files) {
		  const typeData = data.type[0];
		  const catIds = data.ids[0];
		  if(catIds.indexOf(",") > -1){
			catID = catIds.split(',');
		  } else {
			catID = catIds;
		  }
		   var typeObject = {};
		   typeObject[typeData] = catID;
		   User.distinct('_id',typeObject)
		  .exec(function(err, userIDs){
			  if(err){
				return res.send({
					code: httpResponseCode.BAD_REQUEST,
					message: httpResponseMessage.INTERNAL_SERVER_ERROR,
					err:err
				  });
			 } else {
			  if (!userIDs) {
				res.json({
				  message: httpResponseMessage.USER_NOT_FOUND,
				  code: httpResponseMessage.BAD_REQUEST
				});
			  }
			   else {
					//console.log('result',userIDs);
					  Product.find({userId: {$in: userIDs},'productStatus': 1})
						.populate('productCategory',['title'])
						.exec(function(err,resultpro){
							if (err) {
							 return res.send({
								code: httpResponseCode.BAD_REQUEST,
								message: httpResponseMessage.INTERNAL_SERVER_ERROR
							 })
							} else {
							if (!resultpro) {
								res.json({
									message: httpResponseMessage.USER_NOT_FOUND,
									code: httpResponseMessage.BAD_REQUEST
								});
							} else {
							  return res.json({
								code: httpResponseCode.EVERYTHING_IS_OK,
								result: resultpro
							  });
							}
						 }
					 });
				   }
			}
		})
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

/** Auther	: Rajiv Kumar
 *  Date	: July , 2018
 *	Description : Function to getLoggedInUser
 **/
const getLoggedInUser = (req, res) => {
	var token = getToken(req.headers);
	if(token){
		var totalNotifications  = 0;
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
		  User.findOne({_id: userId}).then(function(user){
			Notification.find({toUserId:1,isRead:0}, function (err, notifications) {
			if(err){
				return res.json({
				  message: 'notification Error',
				  code: httpResponseMessage.BAD_REQUEST
				});
			  }
			  return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				message: httpResponseMessage.SUCCESSFULLY_DONE,
				result: user,
				totalNotifications:notifications.length,
				notifications : notifications,
				notification_type:constant.notification_type
		    });
	     });
     });
  } else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
  }
}



/** Auther	: Rajiv Kumar
 *  Date	: August 3, 2018
 *	Description : Function to change the notification status as Read
 **/
const readNotification = (req, res) => {
  Notification.update({ _id:req.body._id },  { "$set": { "isRead": 1 } }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else {
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.EMAIL_VERIFY_SUCCESSFULLY,
             result: result
         });
      }
    }
  })
}


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to verify user email
 **/
const verifyEmail = (req, res) => {
  User.update({ _id:req.params.id },  { "$set": { "emailVerified": 1 } }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else {
        return res.json({
           code: httpResponseCode.EVERYTHING_IS_OK,
           message: httpResponseMessage.EMAIL_VERIFY_SUCCESSFULLY,
           result: result
        });
      }
    }
  })
}




/** Auther	: Rajiv Kumar
 *  Date	: Aug 20, 2018
 *	Description : Function to verify user email via web
 **/
const verifyUserEmail = (req, res) => {
  User.update({ _id:req.params.id },  { "$set": { "emailVerified": 1 } }, { new:true }, (err,result) => {
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
              message: httpResponseMessage.EMAIL_VERIFY_SUCCESSFULLY,
              result: result
            });

      }
    }
  })
}


/** Auther	: Rajiv Kumar
 *  Date	: Sept 14, 2018
 *	Description : Function to add rating on user completed trade
 **/
const newTradeUserRating = (req, res) => {
  const data = req.body;
      let now = new Date();
        UserTradeRating.create(req.body, (err, result) => {
        if (err) {
          return res.send({
			errr : err,
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          })
        } else {
          return res.send({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: result
          })
        }
    })
}

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to delete the user
 **/
const mostTrustedUsers = (req, res) => {
console.log("mostTrustedUsers")
UserTradeRating.aggregate([{
           $unwind: '$userId'
		}, {
			$group: {
				_id: '$userId',
				totalRating:{ $avg: { $divide: [ "$review", 10 ] } },
				 count: { $sum: 1 }
			}
		}])  
    .exec(function(err, transactions) {
        // Don't forget your error handling
        console.log("transactions",transactions)
        UserTradeRating.populate(transactions, {path: '_id',model:'User'}, function(err, populatedTransactions) {
            return res.send({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            result: populatedTransactions
          })
        });
    });

	 //~ UserTradeRating.aggregate([
	 //~ {
        //~ $group:
          //~ {
            //~ _id: "$userId",
            //~ totalRating: { $avg: { $divide: [ "$review", 10 ] } },
            //~ count: { $sum: 1 },
            //~ //entries: { $push: "$$ROOT" }
	      //~ }

	 //~ }
	  //~ // Then join
        //~ {
			//~ $lookup: {
				//~ from: "user",
				//~ localField: "userId",
				//~ foriegnField: "_id"
			//~ }
        //~ }

	 //~ ])
      //~ .exec(function(err, users) {
          //~ return res.send({
            //~ code: httpResponseCode.EVERYTHING_IS_OK,
            //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
            //~ result: users
          //~ })
      //~ });
}


/// Log out users
exports.logout = function(req, res, next) {
  var data = req.body;
  var flag = form_validation.validate_all_request(data, ['userId', 'accessToken']);
  if (flag) {
    res.json(flag);
    return;
  }
  var updateObj = {};
  updateObj.accessToken = null;
  User.findOneAndUpdate({
    _id: req.body.userId
  }, {
    '$set': updateObj
  }, {
   projection: {
      email: 1,
      name: 1,
      phoneNumber: 1,
      accessToken: 1,
      profilePic: 1,
      subscriptionPlan: 1,
      userType: 1,
      address: 1,
      zipCode: 1,
      userStatus: 1,
      emailVerified: 1
    },
    new: true
  }).lean().exec(function(err, result) {
    if (err) {
      //console.log("error", err);
      return res.json({
        message: constant.server_error_msg,
        code: constant.server_error_code
      });


    } else {
      req.session.destroy(function(err) {
      //  console.log("Session Destroy")
        return true;
      })
      return res.json({
        message: constant.logout_success_msg,
        code: constant.logout_success_code
      });

    }


  });
}
/** Auther	: Rajiv Kumar
 *  Date	: July 6, 2018
 *	Description : Function to states on admin dashboard
 **/
const dashboardStates = (req, res) => {
	//console.log('dashboardStates from user controller')
	var totalUser = 0
	var totalProduct = 0
	var totalTrade = 0
	var totalDonation =0
	Promise.all([
	/// Get Total users
	User.count(),
	/// Get Total products
	Product.count(),
	/// Get Total donations
	Donation.count(),
	/// Get Total trades
	Trade.count()]).then((values) => {
	  return res.json({
		  code: httpResponseCode.EVERYTHING_IS_OK,
		  message: httpResponseMessage.SUCCESSFULLY_DONE,
		  users: values[0],
		  products: values[1],
		  donations: values[2],
		  trades: values[3]
	  });
	});
}

// User helf or contact us email
/** Auther	: Rajiv Kumar
 *  Date	: July 6, 2018
 *	Description : Function to send the email of user from contact us page
 **/
 const contustUs = (req, res) => {
   // setup email data with unicode symbols
     commonFunction.readHTMLFile('src/views/emailTemplate/contactUsEmail.html', function(err, html) {
       var template = handlebars.compile(html);
       var replacements = {
            name:req.body.name,
            email:req.body.email,
            description:(req.body.description)?req.body.description:''
       };
       var htmlToSend = template(replacements);
       let mailOptions = {
         from: req.body.email, // sender address
         to: constant.SMTP_FROM_EMAIL+',rajiv.kumar@nmgtechnologies.com', // list of receivers
         subject: 'ContactUs ✔', // Subject line
         html : htmlToSend
       };
       commonFunction.transporter.sendMail(mailOptions, function (error, response) {
           if (error) {
             return res.json({
                 code: httpResponseCode.INTERNAL_SERVER_ERROR,
                 message: httpResponseMessage.INTERNAL_SERVER_ERROR,
                 error:error
                 });
           }else{
             return res.json({
                 code: httpResponseCode.EVERYTHING_IS_OK,
                 message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
                 });
           }
       });
   })

  }

/*
//contactus form
const contustUs = (req, res) => {
	console.log('COntact us form');
	res.render('contactus');
 }

const send = (req, res) => {
  console.log(req.body.name);
  const output =`<p>You have a new contact request</p>
  <h3>Contact Deatils</h3>
  <ul>
	<li>${req.body.name}</li>
	<li>${req.body.email}</li>
  </ul>
  <h4>${req.body.message}</h4>`;
		let transporter = nodemailer.createTransport({
			host: constant.SMTP_HOST,
			port: constant.SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				user: constant.SMTP_USERNAME, // generated ethereal user
				pass: constant.SMTP_PASSWORD // generated ethereal password
			}
		});
		let mailOptions = {
			from: constant.SMTP_FROM_EMAIL, // sender address
			to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
			subject: 'Node Contact Request ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			res.render('contactus',{msg:'Email has been send'})
		});
}
*/

/** Auther	: KS
 *  Date	: July , 2018
 *	Description : Function to getLoggedInUser
 **/
const frontNotification = (req, res) => {
	var token = getToken(req.headers);
	if (token) {
		var totalNotifications  = 0;
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
		  User.findOne({_id: userId}).then(function(user){
  			Notification.find({toUserId:userId,isRead:0}, function (err, notifications) {
  			if(err){
  				return res.json({
  				  message: 'notification Error',
  				  code: httpResponseMessage.BAD_REQUEST
  				});
  			}
  			return res.json({
  					code: httpResponseCode.EVERYTHING_IS_OK,
  					message: httpResponseMessage.SUCCESSFULLY_DONE,
  					result: user,
  					totalNotifications:notifications.length,
  					notifications : notifications,
  					notification_type:constant.notification_type
  				});
  			});
       });

  } else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}


/** Auther	: Rajiv Kumar
 *  Date	: Sept 26, 2018
 *	Description : Function to states of user trade
 **/
userTradeStates = (req, res) => {
	var token = getToken(req.headers);
	if (token) {
		var totalNotifications  = 0;
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
  //  console.log("decoded.subscriptionPlan",decoded)
    var totalUser = 0
    var totalProduct = 0
    var totalTrade = 0
    var totalDonation =0
    var totalInventoryAllowed =0
    var totalTradePermitted = 0
    Promise.all([
    User.findOne({_id: userId}),
    /// Get Total products
    Product.find({userId:userId}),
    /// Get Total donations
    Notification.find({toUserId:userId,isRead:0}),
    //function to get user subscriptionPlan and allowed inventory amnd trade.
  //  UserSubscription.find({_id:decoded.subscriptionPlan}),
    Subscription.find({_id:decoded.subscriptionPlan}),
    //get user switch trade
    OfferTrade.find({pitchUserId:userId})
  ]
    ).then((values) => {

        // Subscription.find({'_id':'5b97c4148de80e556889cc11'}, function (err, subs) {
        //     console.log("values",subs)
        // })
  // console.log("values",values[3])
    var subscription = values[3];
    //console.log("subscription.lenght",subscription,subscription.length,decoded.subscriptionPlan)
    if(subscription.length > 0){
      totalInventoryAllowed = subscription[0].totalInventoryAllowed
      totalTradePermitted = subscription[0].totalTradePermitted
    }
    var tradeLeft  = parseInt(totalTradePermitted-values[4].length)
    var inventoryLeft = parseInt(totalInventoryAllowed - values[1].length)
    //console.log("totalInventoryAllowed totalTradePermitted tradeLeft,inventoryLeft",totalInventoryAllowed, totalTradePermitted,tradeLeft,inventoryLeft,values[3])
      return res.json({
        code: httpResponseCode.EVERYTHING_IS_OK,
        message: httpResponseMessage.SUCCESSFULLY_DONE,
        result: values[0],
        totalInvemtory:values[1].length,
		    totalNotifications:values[2].length,
		    notifications:values[2],
		    notification_type:constant.notification_type,
        totalInventoryAllowed : totalInventoryAllowed,
        totalTradePermitted : totalTradePermitted,
        totalTrade : values[4].length,
        tradeLeft:tradeLeft,
        inventoryLeft:inventoryLeft
      });
    });
  } else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}


/** Auther	: Rajiv Kumar
 *  Date	: Sept 26, 2018
 *	Description : Function to get the user subscription plans and addOn's
 **/
userSubscription = (req, res) => {
	var token = getToken(req.headers);
	if (token) {
		var totalNotifications  = 0;
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
    //console.log("decoded.subscriptionPlan",decoded)
    UserSubscription.find({userId:userId})
    .populate({path:'subscriptionId',model:'Subscription'})
    .populate({path:'userId',model:'User'})
    .limit(1)
    .sort({createdAt:-1})
    .exec(function(error,uSubscription){
        if(error){
          return res.json({
            code: httpResponseCode.INTERNAL_SERVER_ERROR,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR,
            error:error
          });
        }else{
          return res.json({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            userSubacriptions: uSubscription
          });
        }
    })
  } else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}

/** Auther	: Rajiv Kumar
 *  Date	: Sept 26, 2018
 *	Description : Function to get the user userSubscriptionAddon plans and addOn's
 **/
userSubscriptionAddon = (req, res) => {
	var token = getToken(req.headers);
	if (token) {
		var totalNotifications  = 0;
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
    //console.log("decoded.subscriptionPlan",decoded)
    UserSubscriptionAddon.find({userId:userId})
    .populate({path:'userSubscriptionId',model:'UserSubscription'})
    .populate({path:'userId',model:'User'})
    .populate({path:'addonId',model:'Addon'})
    .limit(1)
    .sort({createdAt:-1})
    .exec(function(error,uSubscriptionAddon){
        if(error){
          return res.json({
            code: httpResponseCode.INTERNAL_SERVER_ERROR,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR,
            error:error
          });
        }else{
          return res.json({
            code: httpResponseCode.EVERYTHING_IS_OK,
            message: httpResponseMessage.SUCCESSFULLY_DONE,
            userSubacriptionAddons: uSubscriptionAddon
          });
        }
    })
  } else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
}


/** Auther	: Rajiv Kumar
 *  Date	: October 25, 2018
 *	Description : Function to get the user getUserWishListProducts
 **/
getUserWishListProducts = (req, res) => {
  var token = getToken(req.headers);
    var arrOfVals = [];
  if (token) {
       decoded = jwt.verify(token,settings.secret);
       var userId = decoded._id;
        WishList.find({})
          .where('userId').equals(userId)
          .select({ productId: 1})
          .exec(function(err, result){
            if(err){
            return res.json({
                  message: httpResponseMessage.USER_NOT_FOUND,
                  code: httpResponseMessage.BAD_REQUEST
                });
            }
            if (result.length > 0) {
               result.forEach(function(countElement){
                  arrOfVals.push(countElement.productId );
               });
             }
          return res.json({
                      code: httpResponseCode.EVERYTHING_IS_OK,
                      message: httpResponseMessage.SUCCESSFULLY_DONE,
                     result: result,
                     wishlistProducts:arrOfVals
              });
          })

    } else {
     return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}


module.exports = {
	signup,
	userSignup,
	login,
	listUser,
	updateUser,
	viewUser,
	verifyEmail,
	verifyUserEmail,
	changeStatus,
	deleteUser,
	users,
	contustUs,
	//send,
	getLoggedInUser,
  dashboardStates,
  myProfle,
  forgotPassword,
  resetPassword,
  updateNewPassword,
  readNotification,
  sortingUsers,
  mostTrustedUsers,
  frontNotification,
  newTradeUserRating,
  activeUser,
  userTradeStates,
  searchCity,
  userSubscription,
  getUserWishListProducts,
  userSubscriptionAddon

}
