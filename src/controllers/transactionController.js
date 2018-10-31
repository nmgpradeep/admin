const bodyParser = require("body-parser");
const Transaction = require('../models/transaction')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm');

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 *	Description : Function to list the available user on the plateform
 **/
const listTransaction = (req, res) => {
       var perPage = constant.PER_PAGE_RECORD
       var page = req.params.page || 1;
       Transaction.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      //.populate('parent',['title'])
      .populate({path:'userId',model:'User'})
      .exec(function (err, country){
          Transaction.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: country ,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to list all category available in  collection
const transactions = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  Transaction.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('parent',['title'])
    .exec(function(err, categories) {
        Transaction.countDocuments().exec(function(err, count) {
          if (err) return next(err)
            return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: categories,
                total : count,
                current: page,
                perPage: perPage,
                pages: Math.ceil(count / perPage)
            });
          })
      });
  }
/** Auther	: Karnika sharmalistTransaction
 *  Date	: July 3, 2018
 *	Description : Function to view the available user details
 **/
const viewTransaction = (req, res) => {
	const id = req.params.id;
	Transaction.findOne({_id:id}, (err, result) => {
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
}



const changeStatus = (req, res) => {
  Transaction.update(
    { _id: req.body._id },
    { $set: { status: req.body.status } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.send({
          code: httpResponseCode.BAD_REQUEST,
          message: httpResponseMessage.INTERNAL_SERVER_ERROR
        });
      } else {
        if (!result) {
          res.json({
            message: httpResponseMessage.CATEGORY_NOT_FOUND,
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
    }
  );
};


const searchQuery =  (req, res) => {	
  var form = new multiparty.Form();
    form.parse(req, function(err, data, files) {
	  console.log('data',data);			  
	  //~ Transaction.find({
			//~ transactionDate: {
				//~ $gt:  data.start,
				//~ $lt:  data.end
			//~ }
		//~ }), function(err, positions) {			
			//~ if (err) {
				//~ console.log("ERR",err)
			//~ }
			//~ else {
				//~ console.log("positions",positions);
				//~ res.json(positions);
			//~ }
		//~ }
		
		var start,
            end;

        // set time zone
        //  moment().tz("Europe/Copenhagen").format();

        start = data.start[0];
        end = data.end[0];
        console.log("start",start)
        console.log("end",end)        

        Transaction.
            find({
                transactionDate: {
                    $gte: start,
                    $lte: end
                }
            },{transactionDate: 1}).
            exec(function(err, bookings) {
                if (err) console.log(err);
                console.log(bookings);

                res.json(bookings);
            });
    });
};


//contactus form 
module.exports = {
	transactions,
	viewTransaction,
	changeStatus,
	listTransaction,
	searchQuery
}
