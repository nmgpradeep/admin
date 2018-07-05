const bodyParser = require('body-parser')
const Category = require('../models/category')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const constant = require("../../common/constant");
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to add category in  collection
const create = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.categoryName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['categoryName']);
  if (flag) {
    return res.json(flag);
  }
  Category.findOne({ categoryName: req.body.categoryName }, (err, result) => {	
    if (result) {

      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_CATEGORYNAME
      })
    } else {
      let now = new Date();      
      Category.create(req.body, (err, result) => {
		  console.log('RES-CATEGORY',err, result);
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
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to list all category available in  collection
const categories = (req, res) => { 	
	console.log('TEST>>>>>>>>>>>>>>>>>Category')
	 Category.find({},(err,result)=>{
		if (!result) {
			res.json({
			  message: httpResponseMessage.ITEM_NOT_FOUND,
			  code: httpResponseMessage.BAD_REQUEST
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
					  message: httpResponseMessage.LISTED_SUCCESSFULLY,
					  result: result
					});

				}
		  }
	  })
}


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to view the available user details
 **/
const viewCategory = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<',id);  
	Category.findOne({_id:id}, (err, result) => {
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


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to update the user details.
 **/
const updateCategory = (req, res) => { 
  Category.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true },(err,result) => {
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
 *  Date	: June 20, 2018
 *	Description : Function to delete the user
 **/
const deleteCategory = (req, res) => {	
	Category.findByIdAndRemove(req.params.id, (err,result) => {
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

module.exports = {
  create,
  categories,
  viewCategory,
  updateCategory,
  deleteCategory
  
}
