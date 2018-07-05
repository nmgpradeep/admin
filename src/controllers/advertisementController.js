const bodyParser = require('body-parser')
const Advertisement = require('../models/advertisement')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 **/
///function to save new advertisement in the list
const create = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.advertisementName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['advertisementName']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
    
      Advertisement.create(req.body, (err, result) => {
		  console.log('RES-advertisement',err, result);
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
/// function to list all advertisement
const advertisements = (req, res) => { 
  Advertisement.find({},(err,result)=>{
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
	  })
}


/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 *	Description : Function to view the advertisement details
**/
const viewadvertisement = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<advertisement>>>>',id);  
	Advertisement.findById({_id:id}, (err, result) => {
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
 *	Description : Function to update the advertisement
 **/
const updateadvertisement = (req, res) => { 
  Advertisement.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
 *  Date	: June 25, 2018
 *	Description : Function to delete the advertisement
 **/
const deleteadvertisement = (req, res) => {	
	Advertisement.findByIdAndRemove(req.params.id, (err,result) => {
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


/** Auther	: Rajiv Kumar
 *  Date	: June 25, 2018
 *	Description : Function to update the advertisement status.
 **/
const updateStatus = (req, res) => { 
	console.log("REQ0",req.body)
  Advertisement.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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
  advertisements,
  viewadvertisement,
  updateadvertisement,
  deleteadvertisement,
  updateStatus 
}
