const bodyParser = require('body-parser')
const Country = require('../models/country')
const State = require('../models/state')
const City = require('../models/city')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant  = require('../../common/constant')

const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm'); //GraphicsMagick for node.js

/*
    *Author: Saurabh Agarwal
    *Date  : July 16, 2017
*/
//Function to save new country in the list
const createCountry = (req, res) => {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.countryName) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.REQUIRED_DATA
      })
    }
    const data = req.body;
    const flag = validation.validate_all_request(data, ['countryName']);
    if (flag) {
      return res.json(flag);
    }
        let now = new Date();
      
        Country.create(req.body, (err, result) => {
            console.log('RES-countryName',err, result);
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
    *Date  : July 16, 2018
*/
//Function to list all country
const listCountry = (req,res) => {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Country.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      //.populate({path: "author", model :"User"})
      .exec(function (err, country){
          Country.count().exec(function(err, count) {
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

  
/*
    *Author: Rajiv Kumar
    *Date  : Aug 20, 2018
*/
//Function to list all country/state/city
const getCountryStateCity = (req,res) => {  
	Country.find({})
      .sort({createdAt:-1})
      //.populate({path: "author", model :"User"})
      .exec(function (err, country){
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: country ,
              });         
        });
}

  
/*
    *Author: Saurabh Agarwal
    *Date  : July 16, 2017
*/
//Function to view all country
const viewCountry = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<Country>>>>',id);  
	Country.findById({_id:id}, (err, result) => {
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
 *  Date	: July 16, 2018
 **/
//Function to update the Country
const updateCountry = (req, res) => { 
  Country.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 */
/// function to list all cities
const listingCity = (req, res) => {  
	City.find({})
      .sort({createdAt:-1})
      .populate('stateSelect',['stateName'])
      //.populate('userId',['firstName','lastName'])
      .exec(function (err, country){
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: country ,
              });         
        });
 }
/** Author	: Saurabh Agarwal
 *  Date	: July 16, 2018
 **/
//Function to delete the Country
const deleteCountry = (req, res) => {	
	Country.findByIdAndRemove(req.params.id, (err,result) => {
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


/** Author	: Saurabh Agarwal
 *  Date	: July 16, 2018
 **/
//Function to update the Country status.
const updateStatus = (req, res) => { 
	console.log("REQ0",req.body)
  Country.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
///function to save new State in the list
const createStates = (req, res) => {
  console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.stateName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['stateName']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
    
      State.create(req.body, (err, result) => {
		  console.log('RES-stateName',err, result);
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 */
/// function to list all States
const listStates = (req, res) => {     
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    State.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .populate('country')
      //.populate({path: "author", model :"User"})
      .exec(function (err, state){
          State.count().exec(function(err, count) {
            if (err) return next(err)
          //  console.log('The author is %s', testimonial[0].author);
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: state ,
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
const listingStates = (req, res) => {  
	State.find({}, (err, result) => {
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
 */
/// function to list all States
const listingcities = (req, res) => {  
	City.find({}, (err, result) => {
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
//Function to view the State details
const viewStates = (req, res) => {
	const id = req.params.id;
	console.log('<<<<<<<<<<<States>>>>',id);  
	State.findById({_id:id}, (err, result) => {
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
  
const getState = (req, res) => { 
  State.find({ country:req.params.id }, req.body, { new:true },(err,result) => {
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
/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to update the States
const updateStates = (req, res) => { 
  State.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to delete the States
const deleteStates = (req, res) => {	
	State.findByIdAndRemove(req.params.id, (err,result) => {
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


/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to update the States status.
const changeStatus = (req, res) => { 
console.log("REQ0",req.body)
  State.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
///function to save new City in the list
const createCitys = (req, res) => {
  //console.log('<<<<<<<<<<<', JSON.stringify(req.body))
  if (!req.body.cityName) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    })
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ['cityName']);
  if (flag) {
    return res.json(flag);
  }
      let now = new Date();
      City.create(req.body, (err, result) => {
		  console.log('RES-cityName',err, result);
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

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 */
/// function to list all Citys
const listCitys = (req, res) => { 
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    City.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .populate('countrySelect',(['countryName']))
      .populate('stateSelect')
      .exec(function (err, city){
          City.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: city ,
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
**/
//Function to view the City details
const viewCitys = (req, res) => {
	const id = req.params.id;
	City.findById({_id:id}, (err, result) => {
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
//Function to update the City
const updateCitys = (req, res) => { 
  City.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
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
              message: httpResponseMessage.SUCCESSFULLY_DONE,
             result: result
            });
      }
    }    
  })
}

/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to delete the Citys
const deleteCitys = (req, res) => {	
	City.findByIdAndRemove(req.params.id, (err,result) => {
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


/** Author	: Saurabh Agarwal
 *  Date	: July 17, 2018
 **/
//Function to update the City status.
const Status = (req, res) => { 
	console.log("REQ0",req.body)
  City.update({ _id:req.body._id },  { "$set": { "status": req.body.status } }, { new:true }, (err,result) => {
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


/** Author	:Rajiv Kumar
 *  Date	: Aug 20, 2018
 * get city by state
 **/

const getCity = (req, res) => { 
  console.log('state IDDDD',req.params);
  City.find({ stateSelect:req.params.id }, req.body, { new:true },(err,result) => {
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


const activeCities = (req,res) => {
	 City.find({status:1})
	    .exec(function(err,result){
			if (err) {
			 return res.send({
				code: httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			 })
			} else {
			if (!result) {
				res.json({
					message: httpResponseMessage.CITY_NOT_FOUND,
					code: httpResponseMessage.BAD_REQUEST
				});
			} else {
			 return res.json({
				code: httpResponseCode.EVERYTHING_IS_OK,
				result: result
			  });
			}
		 }
	 });
}


module.exports = {
  createCountry,
  listCountry,
  updateCountry,
  viewCountry,
  deleteCountry,
  updateStatus,
  createStates,
  listStates,
  viewStates,
  updateStates,
  deleteStates,
  changeStatus,
  createCitys,
  listCitys,
  listingStates,
  updateCitys,
  viewCitys,
  deleteCitys,
  Status,
  getState,
  listingcities,
  getCountryStateCity,
  getCity,
  listingCity,
  activeCities

}
