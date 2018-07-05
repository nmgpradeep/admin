//const bodyParser = require('body-parser')
const Transaction = require('../models/transaction')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const constant = require("../../common/constant");
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');


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
      .exec(function(err, transactions) {
          Transaction.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: transactions,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
        })
    });
}

/** Auther	: Karnika sharma
 *  Date	: July 3, 2018
 *	Description : Function to view the available user details
 **/
const viewTransaction = (req, res) => {
	const id = req.params.id;
	console.log('<<<asdasfdsafsafdasfdadadfasfd<<<<<<<<',id);
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


//contactus form 
module.exports = {
	listTransaction,
	viewTransaction
}
