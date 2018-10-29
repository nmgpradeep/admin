const bodyParser = require('body-parser')
const Subscription = require('../models/subscription')
const UserSubscription = require('../models/userSubscription')
const User = require('../models/User')
const Addon = require('../models/addon')
const Transaction = require('../models/transaction')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require('../../common/constant')
const commonFunction = require("../../common/commonFunction");
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const app = require("express")();
const keyPublishable = constant.StripeKeyPublic;
const keySecret = constant.StripeKeySecret;
const stripe = require("stripe")(keySecret);

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new Subscription plan in the list
const create = (req, res) => {
  //console.log('<<<<<<<<<<< Subscriptions', JSON.stringify(req.body))
  if (!req.body.subscriptionName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  // const limitFlag =req.body
  // if(limitFlag){
  //   return res.json(limitFlag)
  // }
  // else{
  //   limitFlag = true
  // }

  const flag = validation.validate_all_request(data, ['subscriptionName']);
  if (flag) {
    return res.json(flag);
  }
  Subscription.findOne({ subscriptionName: req.body.subscriptionName}, (err, result) => {
    if (result) {

      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      let now = new Date();

      Subscription.create(req.body, (err, result) => {
		  console.log('RES-Subscription',err, result);
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
  })
}

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all Subscription plan
const subscriptions = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
    Subscription.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .exec(function(err, subscription) {
          Subscription.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: subscription,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}

/** Author	: Rajiv Kumar
 *  Date	: October 8, 2018
 */
/// function to list all active subscriptionPlan
const listSubscriptionPlans = (req, res) => {
	Subscription.find({status:0})
  .sort({createdAt:1})
  .exec(function(err, subscriptions) {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!subscriptions) {
        res.json({
          message: httpResponseMessage.USER_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else {
        return res.json({
             code: httpResponseCode.EVERYTHING_IS_OK,
             result: subscriptions
        });
      }
    }
  })
 }

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 */
/// function to list all States
const listingsubscription = (req, res) => {
	Subscription.find({}, (err, result) => {
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
  })
 }
/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to view the available Subscription plan
**/
const viewSubscription = (req, res) => {
	const id = req.params.id;
//	console.log('<<<<<<<<<<<Product>>>>',id);
	Subscription.findById({_id:id}, (err, result) => {
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
             result: result
            });

      }
    }
  })
}


/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to update the Subscription plan details.
 **/
const updateSubscription = (req, res) => {
  Subscription.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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

/** Auther	: Rajiv kumar
 *  Date	: June 21, 2018
 *	Description : Function to delete the Subscription plan
 **/
const deleteSubscription = (req, res) => {
	Subscription.findByIdAndRemove(req.params.id, (err,result) => {
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

/**Auther : Saurabh Agarwal
 * Date   : July 25, 2018
 * Description  : Function for unlimited subscription
*/
const unlimited = (req,res) => {
  Subscription.update({ _id : req.body._id }, {"$set" :{"unlimited":req.body.unlimited}}, {new : true}, (err, result) => {
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
             result: result
            });
      }
    }

  })
}

const unlimitedUpdate = (req, res) => {
  Subscription.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
        return res.json({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });

      }
    }
  })
}


/**
 * Auther : Rajiv Kumar
 * Date: July 6, 2018
 * Function : Change the status of subscription plan as active and inactive
 *
 **/
const changeStatus = (req,res) => {
	Subscription.update({ _id : req.body._id }, {"$set" :{"status":req.body.status}}, {new : true}, (err, result) => {
		if(err){
			 return res.json({
				code : httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			});
		}else{
			if(!result){
					return res.json({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.ITEM_NOT_FOUND
					});
			} else {
				return res.json({
					 code:httpResponseCode.EVERYTHING_IS_OK,
					 message:httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
					 result:result
					});
			}
		}
	})
}

/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
///function to save new Addon plan in the list
const newAddon = (req, res) => {
  if (!req.body.packageName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['packageName']);
  if (flag) {
    return res.json(flag);
  }
  Addon.findOne({ packageName: req.body.packageName}, (err, result) => {
    if (result) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_EMAIL
      })
    } else {
      let now = new Date();

      Addon.create(req.body, (err, result) => {
		//  console.log('RES-addon',err, result);
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
  })
}

/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 */
/// function to list all listAddon plan
const listAddon = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
    Addon.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, addon) {
          Addon.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: addon,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
             });
         })
    });
}


/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to view the available viewAddon plan
**/
const viewAddon = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<packageName>>>>',id);
	Addon.findById({_id:id}, (err, result) => {
    if (err) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.INTERNAL_SERVER_ERROR
      })
    } else {
      if (!result) {
        res.json({
          message: httpResponseMessage.ITEM_NOT_FOUND,
          code: httpResponseMessage.BAD_REQUEST
        });
      } else {
        return res.json({
            code: httpResponseCode.EVERYTHING_IS_OK,
            result: result
         });
      }
    }
  })
}


/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to update the updateAddon plan.
 **/
const updateAddon = (req, res) => {
  Addon.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.ITEM_NOT_FOUND,
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

/** Auther	: Rajiv kumar
 *  Date	: June 22, 2018
 *	Description : Function to delete the Addon plan
 **/
const deleteAddon = (req, res) => {
	Addon.findByIdAndRemove(req.params.id, (err,result) => {
    if(err){
		return res.json({
          message: httpResponseMessage.ITEM_NOT_FOUND,
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

/** Auther	: Saurabh Agarwal
 *  Date	: July 6, 2018
 **/
//Function to update the Addon status.
const updateStatus = (req, res) => {
 console.log("REQ0",req.body)
  Addon.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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
              message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
             result: result
          });
      }
    }
  })
}

/** Auther	: Rajiv Kumar
 *  Date	: October 08, 2018
 *	Description : Function to update the user status.
 **/
const saveUserSubscriptionPlan = (req, res) => {
//  console.log("saveUserSubscriptionPlan",req.body)
  User.update({ _id:req.body.userId },  { "$set": { "subscriptionPlan": req.body.subscriptionId,"subscriptionStatus":1} }, { new:true }, (err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      //  console.log("result user",result)
      let data = {}
        data.subscriptionId =req.body.subscriptionId
        data.userId = req.body.userId
        data.status = 1
        UserSubscription.create(data, (err, responceData) => {
          if(err){
            return res.send({
              code: httpResponseCode.BAD_REQUEST,
              message: httpResponseMessage.INTERNAL_SERVER_ERROR
            });
          }else{
              //console.log("responceData",responceData)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
                 result: responceData
                });
            }
      })
    }
  })
}


/** Auther	: Rajiv Kumar
 *  Date	: October 08, 2018
 *	Description : Function to pay subscription plan on stripe
 **/
const payOnStripe = (req, res) => {
  //console.log("payOnStripe", req.body)
  stripe.customers.create({
      email: req.body.userEmail,
      source: {
        object: 'card',
        exp_month: req.body.expiryMonth,
        exp_year: req.body.expiryYear,
        number: req.body.cardNumber,
        cvc: req.body.cardCVV
      }
    }).then(function(customer) {
      //console.log("customer",customer)
      return stripe.charges.create({
        amount: req.body.amount*100,
        currency: 'usd',
        customer: customer.id
      });
    }).then(function(charge) {
    //  console.log("charge",charge)
    // New charge created on a new customer
    User.updateMany({ _id:req.body.userId },  { "$set": { "subscriptionPlan": req.body.subscriptionId,"subscriptionStatus":"1"} }).then(function(user){
      //console.log("user",user)
    });
    let data = {}
      data.subscriptionId =req.body.subscriptionId
      data.userId = req.body.userId
      data.status = 1
      data.transactionId = charge.id
      data.transactionStatus = (charge.status === 'succeeded')?1:0
      data.transactionResponceMessage = charge.status
      data.transactionAmount = (charge.amount/100)
      UserSubscription.create(data, (err, responceData) => {
        if(err){
          return res.send({
            code: httpResponseCode.BAD_REQUEST,
            message: httpResponseMessage.INTERNAL_SERVER_ERROR
          });
        }else{
			
			let TransactionData = {};
				TransactionData.transactionId = charge.id
				TransactionData.transactionType = 'Subscription'
				TransactionData.userId = req.body.userId
				TransactionData.paymentId = charge.id
				TransactionData.transactionAmount = (charge.amount/100)
				TransactionData.status = (charge.status === 'succeeded')?1:0
				TransactionData.transactionDate = new Date();
				Transaction.create(TransactionData, (err, transactionResp) => {
					console.log("transactionResp",transactionResp)
				});					
				// console.log("responceData",responceData)
    			// setup email data with unicode symbols
                commonFunction.readHTMLFile('src/views/emailTemplate/userSubscriptionConfirmationEmail.html', function(err, html) {
                  var template = handlebars.compile(html);
                  var replacements = {
                       trnxId:charge.id,
                       userName:(req.body.userName)?req.body.userName.toUpperCase():'Subscriber'
                  };
                  var htmlToSend = template(replacements);
                  let mailOptions = {
                    from: constant.SMTP_FROM_EMAIL, // sender address
                    to: req.body.userEmail+',rajiv.kumar@newmediaguru.net', // list of receivers
                    subject: 'Payment success ✔', // Subject line
                    html : htmlToSend
                  };
                  commonFunction.transporter.sendMail(mailOptions, function (error, response) {
                      if (error) {
                          console.log(error);
                      }else{
                        console.log('Message sent: %s', info.messageId);
            						// Preview only available when sending through an Ethereal account
            						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                      }
                  });
              })
            return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
               result: responceData
              });
          }
    })

}).catch(function(err) {
  // Deal with an error
  return res.json({
      code: httpResponseCode.BAD_REQUEST,
      message: err,
     result: err
    });
});
}


module.exports = {
  create,
  subscriptions,
  viewSubscription,
  updateSubscription,
  deleteSubscription,
  unlimited,
  unlimitedUpdate,
  changeStatus,
  newAddon,
  listAddon,
  updateAddon,
  viewAddon,
  deleteAddon,
  updateStatus,
  listingsubscription,
  listSubscriptionPlans,
  saveUserSubscriptionPlan,
  payOnStripe
}
