const bodyParser = require('body-parser')
const Subscription = require('../models/subscription')
const Addon = require('../models/addon')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require('../../common/constant')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
///function to save new Subscription plan in the list
const create = (req, res) => {
  console.log('<<<<<<<<<<< Subscriptions', JSON.stringify(req.body))
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
      // const limitFlag = result.unlimited
      // if(limitFlag=true){
      //   result.totalInventoryAllowed = 'UNLIMITED'
      // }

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
 *	Description : Function to view the available Subscription plan
**/
const viewSubscription = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Product>>>>',id);  
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
  console.log('<<<<<<<<<<< Addon', JSON.stringify(req.body))
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
		  console.log('RES-addon',err, result);
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
  listingsubscription
}
