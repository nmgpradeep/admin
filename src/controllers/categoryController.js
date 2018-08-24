const bodyParser = require("body-parser");
const Category = require("../models/category");
const httpResponseCode = require("../helpers/httpResponseCode");
const httpResponseMessage = require("../helpers/httpResponseMessage");
const constant = require("../../common/constant");
const validation = require("../middlewares/validation");
const moment = require("moment-timezone");
//var Promise = require('bluebird');

/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to add category in  collection
const create = (req, res) => {
  console.log("<<<<<<<<<<<", JSON.stringify(req.body));
  if (!req.body.title) {
    return res.send({
      code: httpResponseCode.BAD_REQUEST,
      message: httpResponseMessage.REQUIRED_DATA
    });
  }
  const data = req.body;
  const flag = validation.validate_all_request(data, ["title"]);
  if (flag) {
    return res.json(flag);
  }
  Category.findOne({ title: req.body.title }, (err, result) => {
    if (result) {
      return res.send({
        code: httpResponseCode.BAD_REQUEST,
        message: httpResponseMessage.ALL_READY_EXIST_CATEGORYNAME
      });
    } else {
      let now = new Date();
      if (req.body.parent != "") {
        Category.findOne({ _id: req.body.parent }, (err, result) => {
          Category.create(req.body, (err1, result1) => {
            console.log("RES-CATEGORY", err, result1);
            if (err1) {
              return res.send({
                errr: err1,
                code: httpResponseCode.BAD_REQUEST,
                message: httpResponseMessage.INTERNAL_SERVER_ERROR
              });
            } else {
              if (result.children === null) result.children = [];
              result.children.push(result1);
              console.log("Saving parent with children ID", result);
              result.save();
              return res.send({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE,
                result: result1
              });
            }
          });
        });
      } else {
        req.body.parent = null;
        console.log(
          "IN Else block of Category",
          req.body
        ); /*.then(data => {
          ChildCategory.save();
          ParentCategory.save();
        })*/
        Category.create(req.body, (err, result) => {
          console.log("RES-CATEGORY", err, result);
          if (err) {
            return res.send({
              errr: err,
              code: httpResponseCode.BAD_REQUEST,
              message: httpResponseMessage.INTERNAL_SERVER_ERROR
            });
          } else {
            return res.send({
              code: httpResponseCode.EVERYTHING_IS_OK,
              message: httpResponseMessage.SUCCESSFULLY_DONE,
              result: result
            });
          }
        });
      }
    }
  });
};
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to list all category available in  collection
const categories = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  Category.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    // .populate('sellerId')
    // .populate('receiverId')
    // .populate('sellerProductId')
    .populate('parent',['title'])
    .sort({createdAt:-1})
    .exec(function(err, categories) {
        Category.count().exec(function(err, count) {
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
/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to view the available user details
 **/
const viewCategory = (req,res) => {
  const id = req.params.id;
  console.log("<<<<<<<<<Category<<<<<", id);
  Category.findOne({_id:id})
          .populate({ path: "parent", model: "Category"})
          .exec(function(err, result){
            if(err){
              return res.send({
                code: httpResponseCode.BAD_REQUEST,
                message: httpResponseMessage.INTERNAL_SERVER_ERROR 
              });
            } else{
              if(!result){
                res.json({
                  message: httpResponseMessage.USER_NOT_FOUND,
                  code: httpResponseMessage.BAD_REQUEST
                });
              } else{
                return res.json({
                  code: httpResponseCode.EVERYTHING_IS_OK,
                  result: result
                });
              }
            }
          });
}
// const viewCategory = (req, res) => {
//   const id = req.params.id;
//   console.log("<<<<<<<<<<<", id);
//   Category.findOne({ _id: id }, (err, result) => {
//     if (err) {
//       return res.send({
//         code: httpResponseCode.BAD_REQUEST,
//         message: httpResponseMessage.INTERNAL_SERVER_ERROR
//       });
//     } else {
//       if (!result) {
//         res.json({
//           message: httpResponseMessage.USER_NOT_FOUND,
//           code: httpResponseMessage.BAD_REQUEST
//         });
//       } else {
//         return res.json({
//           code: httpResponseCode.EVERYTHING_IS_OK,
//           result: result
//         });
//       }
//     }
//   });
// };
/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to update the user details.
 **/
const changeStatus = (req, res) => {
  Category.update(
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

/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to update the user details.
 **/
const updateCategory = (req, res) => {
  Category.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
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
    }
  );
};


<<<<<<< HEAD
function populateParents(categories) {
     return Category.populate(categories, { path: "parent" }).then(function(categories) {
     return categories.parent ? populateParents(categories.parent) : Promise.all(categories);
  });
}
=======
//~ function populateParents(categories) {
     //~ return categories.populate(categories, { path: "parent" }).then(function(categories) {
     //~ return categories.parent ? populateParents(categories.parent) : Promise.fulfill(categories);
  //~ });
//~ }
>>>>>>> 0d52ca5f64420b05cd1b8a3ca500c3a4b09106b3


/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allCategories = (req, res) => {
  //var perPage = constant.PER_PAGE_RECORD
  //var page = req.params.page || 1;
  Category.find({})
   // .populate({ path: "children", model: "Category" })
   // .populate({ path: "parent", model: "Category" })
    // .skip(perPage * page - perPage)
    //.limit(perPage)
    .exec(function(err, categories) {
        if (err) return next(err);
        return res.json({
          code: httpResponseCode.EVERYTHING_IS_OK,
          message: httpResponseMessage.SUCCESSFULLY_DONE,
          result: categories
        }); 
    });
   
   
  // Bottom to top query 
  //~ Category.
  //~ find({}).
  //~ populate({
    //~ path: 'parent',
    //~ // Get friends of friends - populate the 'friends' array for every friend
    //~ populate: { path: 'parent' ,
					//~ populate: { path: 'parent' ,
						 //~ populate: { path: 'parent', populate: { path: 'parent', populate: { path: 'parent' }} }
					//~ }
		//~ }
  //~ }).exec(function(err, categories) {
        //~ return res.json({
          //~ code: httpResponseCode.EVERYTHING_IS_OK,
          //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
          //~ result: categories
        //~ }); 
    //~ });
};


/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allCategories11 = (req, res) => {	
  //var perPage = constant.PER_PAGE_RECORD
  //var page = req.params.page || 1;
  //~ Category.find({})
    //~ .populate({ path: "children", model: "Category" })
    //~ .populate({ path: "parent", model: "Category" })
    //~ // .skip(perPage * page - perPage)
    //~ //.limit(perPage)
    //~ .exec(function(err, categories) {
	  //~ populateParents(categories).then(function(){	
        //~ if (err) return next(err);
        //~ return res.json({
          //~ code: httpResponseCode.EVERYTHING_IS_OK,
          //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
          //~ result: categories
        //~ }); 
      //~ });  
          
    //~ });
   
   
  // Bottom to top query 
  //~ Category.
  //~ find({}).
  //~ populate({
    //~ path: 'parent',
    //~ // Get friends of friends - populate the 'friends' array for every friend
    //~ populate: { path: 'parent' ,
					//~ populate: { path: 'parent' ,
						 //~ populate: { path: 'parent', populate: { path: 'parent', populate: { path: 'parent' }} }
					//~ }
		//~ }
  //~ }).exec(function(err, categories) {
	 
        //~ return res.json({
          //~ code: httpResponseCode.EVERYTHING_IS_OK,
          //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
          //~ result: categories
        //~ }); 
     
    //~ });
 
 
 var categories = Category.aggregate([
// reshape the data you'll need further on from each mached doc
// now put a common _id so you can group them, and also put stuff into arrays
{
    $project: {
        id: {$literal: 'id'},
        mainCategory: {
            // if our parent is null, put our data.
            // otherwise put null here.
            $cond: [{$eq: [null, '$parent']}, {_id: '$data.id', name: '$data.title'}, undefined]
        },
        subcat: {
            // here is the other way around.
            $cond: [{$ne: [null, '$parent']}, {_id: '$data.id', name: '$data.title'}, null]

        }
    }
    // that stage produces for each doc either a mainCat or subcat
    // (and the other prop equals to null)
},
// finally, group the things so you can have them together
{
    $group: {
        _id: '$id',
        // a bit hacky, but mongo will yield to it
        mainCategory: {$max: '$mainCategory'},
        subCategories: {
            // this will, unfortunately, also add the `null` we have
            // assigned to main category up there
            $addToSet: '$subcat'
        }
    }
},
// so we get rid of the unwanted _id = 'id' and the null from subcats.
{
    $project: {
        _id: false,
        mainCategory: 1,
        subCategories: {
            $setDifference: ['$subCategories', [null]]
        }
    }
}]).exec(function(err, categories) {
	 
        return res.json({
          code: httpResponseCode.EVERYTHING_IS_OK,
          message: httpResponseMessage.SUCCESSFULLY_DONE,
          result: categories
        }); 
     
    });
 //console.log("categories",categories)
 
 
        
  //~ from: <collection>,
      //~ startWith: <expression>,
      //~ connectFromField: <string>,
      //~ connectToField: <string>,
      //~ as: <string>,
      //~ maxDepth: <number>,
      //~ depthField: <string>,
      //~ restrictSearchWithMatch: <document>
   //~ }
   
  
 //~ Category.aggregate([
	
	//~ {
      //~ $graphLookup: {
         //~ from: "_id",
         //~ startWith: "$parent", //returns an array with the object values
         //~ connectFromField: "parent", // not sure about this
         //~ connectToField: "_id",
         //~ as: "chhhhhhhh",
         //~ maxDepth:5
      //~ }
   //~ }
	  //~ ])                
     //~ .exec(function(err, categories) {	
                  //~ return res.json({
                  //~ code: httpResponseCode.EVERYTHING_IS_OK,
                  //~ message: httpResponseMessage.SUCCESSFULLY_DONE,
                  //~ result: categories
              //~ });
        
        //~ });
        
      //~ console.log("DADDADDADADADADA")  
//~ var descendants=[]
//~ var stack=[];
//~ var item = Category.find({_id:"5b5ac03f261a64354489d47b"});
//~ stack.push(item);
//~ while (stack.length>0){
    //~ var currentnode = stack.pop();
    //~ var children = Category.find({parent:currentnode._id});
    //~ while(true === children.hasNext()) {
        //~ var child = children.next();
        //~ descendants.push(child._id);
        //~ stack.push(child);
    //~ }
//~ }

//~ descendants.join(",")
//~ console.log("descendants",descendants)
//Electronics / Cell_Phones_and_Accessories / Cell_Phones_and_Smartphones
      

};

function populateChield(category,allCateg) {
    Category.find({'parent':category._id})
		.exec(function(err, ccates) {			
			//console.log("populateChield",ccates)
			if(ccates.length !== 0){
				allCateg.push(ccates);
				console.log("populateGrandChield",ccates)
				ccates.forEach(function(cats, index, arr) {
					populateChield(cats,allCateg);
				})    
			}else{
				allCateg.push(ccates);
			}
		
	});
	//console.log("allCateg",allCateg)
	return allCateg
}


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to delete the user
 **/
const deleteCategory = (req, res) => {
  //console.log('<result>',req.params.id);
  Category.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
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
  });
};


module.exports = {
  create,
  categories,
  viewCategory,
  updateCategory,
  deleteCategory,
  changeStatus,
  allCategories
};
