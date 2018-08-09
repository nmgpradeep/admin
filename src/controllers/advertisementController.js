const bodyParser = require('body-parser')
const Advertisement = require('../models/advertisement')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant = require('../../common/constant')
const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm'); //GraphicsMagick for node.js


/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 **/
///function to save new advertisement in the list

const create = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, function(err, data, files) {
	  //console.log('Multiple', err, fields, files);
	   //console.log('FIELD', fields.pageTitle[0]);
	  if (!data.advertisementName) {
		return res.send({
		  code: httpResponseCode.BAD_REQUEST,
		  message: httpResponseMessage.REQUIRED_DATA
		})
	  }	  
	  const flag = validation.validate_all_request(data, ['advertisementName']);
	  if (flag) {
		return res.json(flag);
	  }
		  let now = new Date();		
		  Advertisement.create(data, (err, result) => {
			 // console.log('RES-Page',err, result);
			if (err) {
			  return res.send({
				errr : err,
				code: httpResponseCode.BAD_REQUEST,
				message: httpResponseMessage.INTERNAL_SERVER_ERROR
			  })
			} else {
			//  console.log('Created-Page',err, result);
			 // check file and upload if exist 
			 if((files.image) && files.image.length > 0 && files.image != '') {
				var fileName = files.image[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.image[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.image[0].path, function(err, fileData) {
				  if (err) {
					res.send(err);
					return;
				  }
				  fileName = files.image[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.advertisementimage_path + newfilename;
				  //return res.json(process.cwd());
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  res.send(err);
					  return;
					}          

				  });
				});
				Advertisement.update({ _id:result._id },  { "$set": { "image": newfilename } }, { new:true }, (err,fileupdate) => {
				//	console.log("fileupdate",fileupdate)
				if(err){				
					return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.FILE_UPLOAD_ERROR
					});
				} else {				    
					result.productImage = newfilename;
					return res.send({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					})
				  }
			   })	 
			  }		   
			  ///end file update///	  
			}
		  })
    });  
}

//~ 
//~ 
//~ 
//~ 
//~ 
//~ 
//~ const create = (req, res) => {
  //~ var form = new multiparty.Form();
  //~ form.parse(req, function(err, data, files) {
	  //~ if (!data.advertisementName) {
		//~ return res.send({
		  //~ code: httpResponseCode.BAD_REQUEST,
		  //~ message: httpResponseMessage.REQUIRED_DATA
		//~ })
	  //~ }	  
	  //~ //console.log('asdfasdfasdfasdfasdfasdfasfdasdfadf',data);
	  //~ const flag = validation.validate_all_request(data, ['advertisementName']);
	  //~ if (flag) {
		//~ return res.json(flag);
	  //~ }
		  //~ let now = new Date();		
		  //~ Advertisement.create(data, (err, result) => {
			  //~ console.log('RES-Page',err, result);
			//~ if (err) {
			  //~ return res.send({
				//~ errr : err,
				//~ code: httpResponseCode.BAD_REQUEST,
				//~ message: httpResponseMessage.INTERNAL_SERVER_ERROR
			  //~ })
			//~ } else {
			  //~ console.log('Created-Page',err, result);
			 //~ // check file and upload if exist 
			 //~ if ((files.image) && files.image.length > 0 && files.image != '') {
				//~ var fileName = files.image[0].originalFilename;
				//~ var ext = path.extname(fileName);
				//~ var newfilename = files.image[0].fieldName + '-' + Date.now() + ext;
				//~ fs.readFile(files.image[0].path, function(err, fileData) {
				  //~ if (err) {
					//~ res.send(err);
					//~ return;
				  //~ }
				  //~ fileName = files.image[0].originalFilename;
				  //~ ext = path.extname(fileName);
				  //~ newfilename = newfilename;
				  //~ pathNew = constant.advertisementimage_path + newfilename;
				  //~ //return res.json(process.cwd());
				  //~ fs.writeFile(pathNew, fileData, function(err) {
					//~ if (err) {
					  //~ res.send(err);
					  //~ return;
					//~ }          
//~ 
				  //~ });
				//~ });
			  //~ }		
			  //~ console.log('resultImages',result);	 
			  //~ Advertisement.update({ _id:result._id },  { "$set": { "image": newfilename } }, { new:true }, (err,fileupdate) => {
				//~ if(err){				
					//~ return res.send({
						//~ code: httpResponseCode.BAD_REQUEST,
						//~ message: httpResponseMessage.FILE_UPLOAD_ERROR
					//~ });
				//~ } else {				    
					//~ result.image = newfilename;
					//~ return res.send({
						//~ code: httpResponseCode.EVERYTHING_IS_OK,
						//~ message: httpResponseMessage.SUCCESSFULLY_DONE,
						//~ result: result
					//~ })
				  //~ }
			   //~ })	  
			  //~ ///end file update///	  
			//~ }
		  //~ })
       //~ });  
//~ }


/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 */
/// function to list all advertisement
const advertisements = (req, res) => { 
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Advertisement.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({createdAt:-1})
      .exec(function(err, advertisement) {
          Advertisement.count().exec(function(err, count) {
            if (err) return next(err)
              return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  message: httpResponseMessage.SUCCESSFULLY_DONE,
                  result: advertisement,
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
 *	Description : Function to view the advertisement details
**/
const viewadvertisement = (req, res) => {
	const id = req.params.id;
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
  var form = new multiparty.Form();
	form.parse(req, function(err, data, files) {
	  //console.log('Multiple', err, fields, files);
	   //console.log('FIELD', fields.pageTitle[0]);
	  if (!data.advertisementName) {
		return res.send({
		  code: httpResponseCode.BAD_REQUEST,
		  message: httpResponseMessage.REQUIRED_DATA
		})
	  }	  
	  const flag = validation.validate_all_request(data, ['advertisementName']);
	  if (flag) {
		return res.json(flag);
	  }
	let now = new Date();
	console.log(data)	
    Advertisement.findOneAndUpdate({ _id:data._id }, data, { new:true },(err,result) => {
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
		   console.log('Created-Page',err, result);
			 // check file and upload if exist 
			 if ((files.image) && files.image.length > 0 && files.image != '') {
				var fileName = files.image[0].originalFilename;
				var ext = path.extname(fileName);
				var newfilename = files.image[0].fieldName + '-' + Date.now() + ext;
				fs.readFile(files.image[0].path, function(err, fileData) {
				  if (err) {
					res.send(err);
					return;
				  }
				  fileName = files.image[0].originalFilename;
				  ext = path.extname(fileName);
				  newfilename = newfilename;
				  pathNew = constant.advertisementimage_path + newfilename;
				  //return res.json(process.cwd());
				  fs.writeFile(pathNew, fileData, function(err) {
					if (err) {
					  res.send(err);
					  return;
					}
				  });
				}); 
			  
			  Advertisement.update({ _id:data._id },  { "$set": { "image": newfilename } }, { new:true }, (err,fileupdate) => {
				if(err){				
					return res.send({
						code: httpResponseCode.BAD_REQUEST,
						message: httpResponseMessage.FILE_UPLOAD_ERROR
					});
				} else {				    
					result.image = newfilename;
					return res.send({
						code: httpResponseCode.EVERYTHING_IS_OK,
						message: httpResponseMessage.SUCCESSFULLY_DONE,
						result: result
					});
				  }				  
				 
			   })				    
            }
            else {
			   return res.json({
				  code: httpResponseCode.EVERYTHING_IS_OK,
				  message: httpResponseMessage.SUCCESSFULLY_DONE,
				 result: result
               });	 	
			}
         }    
        }
      }) 
    });
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
