//const bodyParser = require('body-parser')
const Trade = require('../models/trade')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const md5 = require('md5')
const nodemailer = require('nodemailer');

 
//Auther	: Rajiv Kumar Date	: July 2, 2018
//Description : Function to list the available users with pagination
  const listTrades = (req, res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Trade.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
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
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
 
  const data = req.body;
      let now = new Date();
        Trade.create(req.body, (err, result) => {
		  console.log('RES-Trade',err, result);
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
	console.log('<<<<<<<<<<<Trades>>>>',id);  
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
      }else {
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
	console.log("REQ0",req.body)
  Trade.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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
  listTrades,
  newTrades,
  viewTrades,
  updateStatus
}
