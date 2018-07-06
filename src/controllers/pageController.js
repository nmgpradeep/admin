const bodyParser = require('body-parser')
const Page = require('../models/page')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant =  require('../../common/constant')

/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 **/
///function to save new Page in the list
const create = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.pageTitle) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['pageTitle']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
    
      Page.create(req.body, (err, result) => {
		  console.log('RES-Page',err, result);
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
 *  Date	: June 25, 2018
 */
/// function to list all advertisemet
const pages = (req, res) => { 
	var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Page.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, pages) {
          Page.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: pages,
                  total : count,
                  current: page,
                  perPage: perPage,
                  pages: Math.ceil(count / perPage)
              });
            })
        });
}


/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 *	Description : Function to view the advertisemet details
**/
const viewPage = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<cmsPage>>>>',id);  
	Page.findById({_id:id}, (err, result) => {
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
 *  Date	: June 25, 2018
 *	Description : Function to update the advertisemet
 **/
const updatePage = (req, res) => { 
	 //console.log('<asdasdfasfdasdfasdfsad>',req);
     //Page.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true },(err,result) => {
	 Page.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
      if (!result) {
        res.json({
          message: httpResponseMessage.DATA_NOT_FOUND,
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
 *  Date	: June 25, 2018
 *	Description : Function to delete the advertisemet
 **/
const deletePage = (req, res) => {	
	console.log("DELETE",req.params.id)
	Page.findByIdAndRemove(req.params.id, (err,result) => {
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
 *  Date	: June 25, 2018
 *	Description : Function to update the advertisemet status.
 **/

const updateStatus = (req, res) => {
  Page.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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
  pages,
  viewPage,
  updatePage,
  deletePage,
  updateStatus 
}
