//const bodyParser = require('body-parser')
const Trade = require('../models/trade')
const OfferTrade = require('../models/offerTrade')
const Product = require('../models/product')
const TradePitchProduct = require('../models/tradePitchProduct')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');
const Notification = require('../models/notification')
var settings = require('../config/settings'); // get settings file
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
getToken = function (headers) {
  if(headers && headers.authorization) {
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


//Auther: Rajiv Kumar Date	: July 2, 2018
//Description : Function to list the available users with pagination
  const listTrades = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Trade.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .populate('sellerId')
      .populate('receiverId')
      .populate('sellerProductId')
      .populate('receiverProductId')
      .exec(function(err, trades) {
          Trade.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: trades,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
    }


/** Auther	: Rajiv kumar
 *  Date	: July 2, 2018
 */
///function to save new Trade in the list
const newTrades = (req, res) => {
  const data = req.body;
      let now = new Date();
        Trade.create(req.body, (err, result) => {
		 // console.log('RES-Trade',err, result);
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

/*
    *Author: Saurabh Agarwal
    *Date  : July 17, 2017
*/
//Function to view all Trades
const viewTrades = (req, res) => {
	const id = req.params.id;
	Trade.findById({_id:id}, (err, result) => {
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to update the Trades status.
const updateStatus = (req, res) => {
  Trade.update({ _id:req.body._id },  { "$set": { "Status": req.body.status } }, { new:true }, (err,result) => {
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


/** Author	: KS
 *  Date	: August 07, 2018
 **/
//Function to update the Trades status.
const returnraised = (req, res) => {
	Trade.findById({_id:req.body._id}, (err, result) => {
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
		    //Trade.sendReturnStatus = 1
            var notification = new Notification({ notificationTypeId:1,fromUserId:result.receiverId,toUserId:1});
				notification.save(function (err) {
				if(err){
					return res.json({
					  code: httpResponseCode.BAD_REQUEST,
					  message: httpResponseMessage.NOTIFICATION_ERROR
					});
				  }
			});
			return res.json({
				 code: httpResponseCode.EVERYTHING_IS_OK,
                 message: httpResponseMessage.CHANGE_STATUS_SUCCESSFULLY,
                 result: result
           });
        }
     }
  })
}

/* #################  functions related to offers trade write in this block ################### */


/** Auther	: Rajiv kumar
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const offerTrade = (req, res) => {
  const data = req.body;
      let now = new Date();
        OfferTrade.create(req.body, (err, result) => {
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



/** Auther	: Rajiv kumar
 *  Date	: September 13, 2018
 */
///function to list offer trade in the offerTrade collections
const offerTrades = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  var token = getToken(req.headers);
   if (token) {
    decoded = jwt.verify(token,settings.secret);
    var userId = decoded._id;
    OfferTrade.find({'status':0}).or([{ 'pitchUserId':userId  }, { 'SwitchUserId': userId }])
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .populate('pitchUserId')
    .populate('SwitchUserId')
    .populate('SwitchUserProductId')
    .exec(function(err, offerTrades) {
        OfferTrade.count().exec(function(err, count) {
          if (err) return next(err)
            return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: offerTrades,
                currentUser:userId,
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


/** Auther	: Rajiv kumar
 *  Date	: September 29, 2018
 */
///function to cancel self offer trade by user offerTrade collections
const cancelOfferTrade = (req, res) => {
  const data = req.body;
      let now = new Date();
        OfferTrade.update({ _id:req.body._id },  { "$set": { "status":"3"} }, { new:true }, (err,result) => {
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


/** Auther	: Rajiv kumar
 *  Date	: September 29, 2018
 */
///function to ditch requested offer trade collections
const ditchOfferTrade = (req, res) => {
  //console.log("ditchOfferTrade req.body",req.body)
  const data = req.body;
      let now = new Date();
      OfferTrade.update({ _id:req.body._id },  { "$set": { "status":"2","ditchCount":req.body.ditchCount} }, { new:true }, (err,result) => {
        //console.log("responce",err,result)
        if (err) {
          //console.log("responce",err,result)
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


/** Auther	: Rajiv kumar
 *  Date	: September 17, 2018
 */
///function to save switch offer trade in the Trade collections
const switchTrade = (req, res) => {
  const data = req.body;
      let now = new Date();
        Trade.create(req.body, (err, result) => {
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



/** Auther	: Rajiv kumar
 *  Date	: September 17, 2018
 */
///function to list the switch details collections
const switchTrades = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  var token = getToken(req.headers);
  if (token) {
         decoded = jwt.verify(token,settings.secret);
         var userId = decoded._id;
         var criteria = {}
          criteria = {'status': 1}
          OfferTrade.distinct('_id',criteria).or([{ 'pitchUserId':userId  }, { 'SwitchUserId': userId }])
          .exec(function(err, switchTradesIds) {
              if (err) return next(err);
              Trade.find({offerTradeId: {$in: switchTradesIds},'status': 1}).populate({path:'offerTradeId',model:'offerTrade',populate:[{path:"pitchUserId",model:"User"},{path:"SwitchUserId",model:"User"},{path:"SwitchUserProductId",model:"Product"}]}).exec(function(err, switchedTrades) {
                  if (err)
                      return next(err)
                      //ok to send the array of mongoose model, will be stringified, each toJSON is called
                      var newSwitchedTrades = [];
                      for(var i in switchedTrades) {
                        //var mycat = Object.assign({}, categories[i]);
                        var mycat = Object.assign({}, switchedTrades[i]);
                        var cat = mycat._doc;
                        cat.trackStatus = 0;
                        cat.messageShow = 0;
                        newSwitchedTrades.push(cat);
                      }

                      return res.json({
                                  code: httpResponseCode.EVERYTHING_IS_OK,
                                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                                  result: newSwitchedTrades,
                                  currentUser:userId
                                  //total : count,
                                  //current: page,
                                //  perPage: perPage,

                                //  pages: Math.ceil(count / perPage)
                              });
              })
          })

    // Trade.find({'status':1}).or([{ 'pitchUserId':userId  }, { 'SwitchUserId': userId }])
    // .skip((perPage * page) - perPage)
    // .limit(perPage)
    // .sort({createdAt:-1})
    // .populate('offerTradeId')
    // .populate('tradePitchProductId')
    // .populate('tradeSwitchProductId')
    // .exec(function(err, switchTrades) {
    //     Trade.count().exec(function(err, count) {
    //       if (err) return next(err)
    //         return res.json({
    //             code: httpResponseCode.EVERYTHING_IS_OK,
    //             message: httpResponseMessage.SUCCESSFULLY_DONE,
    //             result: switchTrades,
    //             currentUser:userId,
    //             total : count,
    //             current: page,
    //             perPage: perPage,
    //
    //             pages: Math.ceil(count / perPage)
    //         });
    //       })
    //   });

    } else {
    return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}



/** Auther	: Rajiv kumar
 *  Date	: September 17, 2018
 */
///function to list the completed pitch details details collections
const completedTrades = (req, res) => {
  var token = getToken(req.headers);
   if (token) {
     decoded = jwt.verify(token,settings.secret);
     var userId = decoded._id;
     var criteria = {}
      criteria = {'status': 1}
      OfferTrade.distinct('_id',criteria).or([{ 'pitchUserId':userId  }, { 'SwitchUserId': userId }])
      .exec(function(err, switchTradesIds) {
      //  console.log("switchTradesIds-userId",switchTradesIds,userId)
          if (err) return next(err);
          Trade.find({offerTradeId: {$in: switchTradesIds},'status': 2}).populate({path:'offerTradeId',model:'offerTrade',populate:[{path:"pitchUserId",model:"User"},{path:"SwitchUserId",model:"User"},{path:"SwitchUserProductId",model:"Product"}]}).exec(function(err, switchedTrades) {
              if (err)
                  return next(err)
                  //ok to send the array of mongoose model, will be stringified, each toJSON is called
                  var newCompletedTrades = [];
                  for(var i in switchedTrades) {
                    //var mycat = Object.assign({}, categories[i]);
                    var mycat = Object.assign({}, switchedTrades[i]);
                    var cat = mycat._doc;
                    cat.trackStatus = 0;
                    cat.messageShow = 0;
                    newCompletedTrades.push(cat);
                  }
                  return res.json({
                       code: httpResponseCode.EVERYTHING_IS_OK,
                       message: httpResponseMessage.SUCCESSFULLY_DONE,
                       result: newCompletedTrades,
                       currentUser:userId
                  });
          })
      })

    } else {
    return res.status(403).send({code: 403, message: 'Unauthorized.'});
    }
}


/** Auther	: Rajiv kumar
 *  Date	: September 20, 2018
 */
///function to save new offer trade in the ditchTrades collections
const ditchTrade = (req, res) => {
  const data = req.body;
      let now = new Date();
        OfferTrade.create(req.body, (err, result) => {
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

/** Auther	: Rajiv kumar
 *  Date	: September 20, 2018
 */
///function to get all ditched trades from the ditchTrades collections
const ditchTrades = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  var token = getToken(req.headers);
   if (token) {
    decoded = jwt.verify(token,settings.secret);
    var userId = decoded._id;
    OfferTrade.find({}).or([{ 'status':3  }, { 'status': 2 }]).or([{ 'pitchUserId':userId  }, { 'SwitchUserId': userId }])
    .where('ditchCount').gt(0).lt(4)
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .populate('pitchUserId')
    .populate('SwitchUserId')
    .populate('SwitchUserProductId')
    .exec(function(err, offerTrades) {
		console.log('offerTrades',offerTrades)
        OfferTrade.count().exec(function(err, count) {
          if (err) return next(err)
            return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: offerTrades,
                currentUser:userId,
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

/*################### functions related to tradePitchProduct write in this block ############ */
/** Auther	: Rajiv kumar
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const tradePitchProduct = (req, res) => {
  const data = req.body;
      let now = new Date();
        TradePitchProduct.create(req.body, (err, result) => {
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
/** Auther	: Rajiv kumar
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const offerTradeProduct = (req, res) => {
	const id =  mongoose.mongo.ObjectId(req.params.id);
	   TradePitchProduct.find({})
        //TradePitchProduct.find({offerTradeId:req.params.id})
        .populate({path:'products',model:'Product',populate:[{path:"productCategory",model:"Category"}]})
         .exec(function(err, offerTradeProduct) {
			 console.log('mmmmmmmmmmmmmmmmm',offerTradeProduct);
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
            result: offerTradeProduct
          })
        }
    })
}
/** Auther	: KS
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const tradingProduct = (req, res) => {
	//const id =  mongoose.mongo.ObjectId(req.params.id);
        TradePitchProduct.find({})
         .exec(function(err, offerTradeProduct) {
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
    					result: offerTradeProduct
    				  })
    			}
        })
}
/** Auther	: KS
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const getAllProduct = (req, res) => {
	var token = getToken(req.headers);
     if(token) {
		     decoded = jwt.verify(token,settings.secret);
		         var userId = decoded._id;
		         Product.find({userId:userId})
        		.populate('userId')
        		.populate('userId',['firstName','lastName'])
        		.populate('productCategory',['title'])
        		.populate('brand',['brandName'])
        		.populate('size',['size'])
	           .exec(function(err, productData){
        		 if (err) {
              			 return res.send({
              				code: httpResponseCode.BAD_REQUEST,
              				message: httpResponseMessage.INTERNAL_SERVER_ERROR
              			 })
        			} else {
            			if (!productData) {
                				res.json({
                					message: httpResponseMessage.USER_NOT_FOUND,
                					code: httpResponseMessage.BAD_REQUEST
                				});
              			} else {
                			 return res.json({
                				code: httpResponseCode.EVERYTHING_IS_OK,
                				result: productData
                			  });
              			}
        		  }
	    });
	 }
}
/** Auther	: KS
 *  Date	: September 13, 2018
 */
///function to save new offer trade in the offerTrade collections
const getProductByCategory = (req, res) => {
	const id = req.params.id;
	var token = getToken(req.headers);
     if(token) {
		decoded = jwt.verify(token,settings.secret);
		var userId = decoded._id;
		Product.find({productCategory:id,userId:userId})
		.populate('userId')
		.populate('userId',['firstName','lastName'])
		.populate('productCategory',['title'])
		.populate('brand',['brandName'])
		.populate('size',['size'])
	    .exec(function(err,productData){
			//console.log('productData',productData)
			if (err) {
			 return res.send({
				code: httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			 })
			} else {
			if (!productData) {
				res.json({
					message: httpResponseMessage.USER_NOT_FOUND,
					code: httpResponseMessage.BAD_REQUEST
				});
			} else {
			 return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				result: productData
			  });
			}
		  }
	    });
	 }
}
/** Auther	: KS
 *  Date	: July 2, 2018
 */

const submitPitchProduct = (req, res) => {
  const data = req.body;
      let now = new Date();
        Trade.create(req.body, (err, result) => {
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


module.exports = {
  listTrades,
  newTrades,
  viewTrades,
  updateStatus,
  returnraised,
  offerTrade,
  offerTrades,
  tradePitchProduct,
  switchTrade,
  switchTrades,
  completedTrades,
  ditchTrade,
  ditchTrades,
  cancelOfferTrade,
  ditchOfferTrade,
  offerTradeProduct,
  tradingProduct,
  getAllProduct,
  getProductByCategory,
  submitPitchProduct
}
