const bodyParser = require('body-parser')
const Page = require('../models/page')
const httpResponseCode = require('../helpers/httpResponseCode')
const httpResponseMessage = require('../helpers/httpResponseMessage')
const validation = require('../middlewares/validation')
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const constant =  require('../../common/constant')

const multiparty = require('multiparty');
const http = require('http');
const path = require('path');
const fs = require('fs'); //FileSystem for node.js
var gm = require('gm'); //GraphicsMagick for node.js
/** Auther	: Rajiv kumar
 *  Date	: June 25, 2018
 **/
///function to save new Page in the list
const create = (req, res) => {
  console.log('<<<<<<<<<<<', req)
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
    
      //~ Page.create(req.body, (err, result) => {
		  //~ console.log('RES-Page',err, result);
        //~ if (err) {
          //~ return res.send({
			//~ errr : err,
            //~ code: httpResponseCode.BAD_REQUEST,
            //~ message: httpResponseMessage.INTERNAL_SERVER_ERROR
          //~ })
        //~ } else {
         
          //~ return res.send({
            //~ code: httpResponseCode.EVERYTHING_IS_OK,
            //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
            //~ result: result
          //~ })

        //~ }
      //~ })
      
      //********************************/
       //~ var form = new multiparty.Form();
  //~ form.parse(req, function(err, data, files) {
      
       //~ if ((files.bannerImage) && files.bannerImage.length > 0 && files.bannerImage != '') {
        //~ var fileName = files.bannerImage[0].originalFilename;
        //~ var ext = path.extname(fileName);
        //~ var newfilename = files.bannerImage[0].fieldName + '-' + Date.now() + ext;

        //~ fs.readFile(files.bannerImage[0].path, function(err, fileData) {

          //~ if (err) {
            //~ res.send(err);
            //~ return;
          //~ }
          //~ fileName = files.bannerImage[0].originalFilename;
          //~ ext = path.extname(fileName);
          //~ newfilename = newfilename;
          //~ pathNew = constant.cmsimage_path + newfilename;
          //~ //return res.json(process.cwd());
          //~ fs.writeFile(pathNew, fileData, function(err) {
            //~ if (err) {
              //~ res.send(err);
              //~ return;
            //~ }
            //~ console.log('Image Uploaded');

          //~ });
        //~ });
      //~ }
      //~ return res.send('DONE');
  //~ }
  var form = new multiparty.Form();
    var size = '';
var fileName = '';
form.on('part', function(part){
    if(!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
});
form.on('file', function(name,file){
    console.log(file.path);
    console.log(__dirname);
    console.log('filename: ' + fileName);
    console.log('fileSize: '+ (size / 1024));
    var tmp_path = file.path
    var target_path = constant.cmsimage_path + fileName;
   // var thumbPath = constant.cmsimage_path';
    fs.renameSync(tmp_path, target_path, function(err) {
        if(err) console.error(err.stack);
    });
    res.redirect('/uploads/fullsize/' + fileName);
        console.log(target_path);
    /*gm(tmp_path)
        .resize(150, 150)
        .noProfile()
        .write(thumbPath + 'small.png', function(err) {
            if(err) console.error(err.stack);       
        });*/
});
form.parse(req);
    
    
    
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
	//console.log('<<<<<<<<<<<cmsPage>>>>',id);  
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
	//const id = req.params.id;
	console.log('RESILTSSSSSSSSSSSSSSSS',req.body);
	 //console.log('<asdasdfasfdasdfasdfsad>',req);
     //Page.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true },(err,result) => {
	 Page.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true },(err,result) => {
    if(err){
		return res.send({
			code: httpResponseCode.BAD_REQUEST,
			message: httpResponseMessage.INTERNAL_SERVER_ERROR
		  });
    }else {
		//console.log('RESILTSSSSSSSSSSSSSSSS',result);
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
