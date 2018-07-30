//const bodyParser = require('body-parser')
const User = require('../models/User')
const Product = require('../models/product')
const Donation = require('../models/donation')
const Trade = require('../models/trade')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');
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
      //let now = new Date();
      let unix_time = moment().unix()
      let salt = data.user_contact + unix_time
      let accessToken = md5(salt)
      req.body.accessToken = accessToken

      User.create(data, (err, result) => {

		  //console.log('RES-FIND',err, result);
        
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
				} else {				    
					result.profilePic = newfilename;
					return res.json({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					})
				  }
			   })	  
			  }		
			  ///end file update///	  
			
			delete result.password

				// Generate test SMTP service account from ethereal.email
				// Only needed if you don't have a real mail account for testing

					// create reusable transporter object using the default SMTP transport
					let transporter = nodemailer.createTransport({
						host: constant.SMTP_HOST,
						port: constant.SMTP_PORT,
						secure: false, // true for 465, false for other ports
						auth: {
							user: constant.SMTP_USERNAME, // generated ethereal user
							pass: constant.SMTP_PASSWORD // generated ethereal password
						}
					});
					host=req.get('host');
					link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
					// setup email data with unicode symbols
					let mailOptions = {
						from: constant.SMTP_FROM_EMAIL, // sender address
						to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
						subject: 'Please confirm your Email account ✔', // Subject line
						text: 'Hello world?', // plain text body
						html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						// Preview only available when sending through an Ethereal account
						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

						// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
						// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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
    if (!req.body.email && !req.body.password && !req.body.userType) {
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
			// session.startSession(req, res, sessionValue)
			// req.session.put('user',result);
			// var value = req.session.get('user');
			// console.log("SESSION VARIABLE",value);	
         
          // set the use data in to session
             req.session.user = result; 
             console.log("LOgin SESSION ", req.session)
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




/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to list the available user on the plateform
 **/
const listUser = (req, res) => {	
	
  var token = getToken(req.headers);  
  if (token) {	  
		decoded = jwt.verify(token,settings.secret);	  
		var userId = decoded.id;
		console.log("decoded",decoded)
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

//Auther	: Rajiv Kumar Date	: June 22, 2018
//Description : Function to list the available users with pagination
  const users = (req, res) => {
	  //console.log("SESSION",req.session)
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    User.find({ userType: { $ne: 1 }})
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
/** Auther	: karnika sharma
 *  Date	: July 6, 2018
 *	Description : Function to view the available user details
 **/
const viewAdmin = (req, res) => {
var token = getToken(req.headers);  
   if (token) {	  
		decoded = jwt.verify(token,settings.secret);	  
		var userId = decoded.id;
		console.log("decoded",decoded)
		  
		  const id = req.params;
		  //console.log('<<<<<<<<<<<',req.params); 
		 
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
					  message: httpResponseMessage.SUCCESSFULLY_DONE,
					 result: result
					});

			  }
			}
		  })
	}else {
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
	  //console.log('Multiple', err, fields, files);
	   //console.log('FIELD', fields.pageTitle[0]);
	  // if (!data.advertisementName) {
		// return res.send({
		//   code: httpResponseCode.BAD_REQUEST,
		//   message: httpResponseMessage.REQUIRED_DATA
		// })
	  // }	  
	  // const flag = validation.validate_all_request(data, ['advertisementName']);
	  // if (flag) {
		// return res.json(flag);
	  // }
	let now = new Date();
	console.log(data)	
    User.findOneAndUpdate({ _id:data._id }, data, { new:true },(err,result) => {
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
      } else {
		   console.log('Created-Page',err, result);
			 // check file and upload if exist 
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
  // User.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
  //   if(err){
	// 	return res.send({
	// 		code: httpResponseCode.BAD_REQUEST,
	// 		message: httpResponseMessage.INTERNAL_SERVER_ERROR
	// 	  });
  //   }else {
  //     if (!result) {
  //       res.json({
  //         message: httpResponseMessage.USER_NOT_FOUND,
  //         code: httpResponseMessage.BAD_REQUEST
  //       });
  //     }else {
  //       return res.json({
  //             code: httpResponseCode.EVERYTHING_IS_OK,
  //             message: httpResponseMessage.SUCCESSFULLY_DONE,
  //            result: result
  //           });

  //     }
  //   }
  // })
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
	
	if (token) {	  
		decoded = jwt.verify(token,settings.secret);	  
		var userId = decoded._id;
		console.log("decoded",decoded,userId)
		  User.findOne({_id: userId}).then(function(user){       
			return res.json({
				  code: httpResponseCode.EVERYTHING_IS_OK,
				  message: httpResponseMessage.SUCCESSFULLY_DONE,
				 result: user
				});
        });		
  }else {
	 return res.status(403).send({code: 403, message: 'Unauthorized.'});
	}
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
      console.log("error", err);

      return res.json({
        message: constant.server_error_msg,
        code: constant.server_error_code
      });


    } else {
      req.session.destroy(function(err) {
        console.log("Session Destroy")
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
	console.log('dashboardStates from user controller')
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

  // Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: constant.SMTP_HOST,
			port: constant.SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				//~ user: account.user, // generated ethereal user
				//~ pass: account.pass // generated ethereal password
				user: constant.SMTP_USERNAME, // generated ethereal user
				pass: constant.SMTP_PASSWORD // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: constant.SMTP_FROM_EMAIL, // sender address
			to: 'rajiv.kumar.newmediaguru@gmail.com, rajiv.kumar@newmediaguru.net', // list of receivers
			subject: 'Node Contact Request ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			res.render('contactus',{msg:'Email has been send'})
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		});
}

module.exports = {
	signup,
	login,
	listUser,
	updateUser,
	viewUser,
	verifyEmail,
	changeStatus,
	deleteUser,
	users,
	contustUs,
	send,
	dashboardStates,
	viewAdmin,
	getLoggedInUser
}
