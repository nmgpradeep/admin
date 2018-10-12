const bodyParser = require("body-parser");
const Category = require("../models/category");
const httpResponseCode = require("../helpers/httpResponseCode");
const httpResponseMessage = require("../helpers/httpResponseMessage");
const constant = require("../../common/constant");
const validation = require("../middlewares/validation");
const moment = require("moment-timezone");
//var Promise = require('bluebird');


// method
const Promise = require('bluebird');
/** Auther	: Rajiv Kumar
 *  Date	: June 18, 2018
 */
/// function to add category in  collection
const create = (req, res) => {
  //console.log("<<<<<<<<<<<", JSON.stringify(req.body));
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
      //let now = new Date();
      //~ if (req.body.parent != "") {
        //~ Category.findOne({ _id: req.body.parent }, (err, result) => {
			//~ console.log("result",result)

			  //~ Category.create(req.body, (err1, result1) => {
			 //~ //  console.log("RES-CATEGORY", err, result1);
				//~ if (err1) {
				  //~ return res.send({
					//~ errr: err1,
					//~ code: httpResponseCode.BAD_REQUEST,
					//~ message: httpResponseMessage.INTERNAL_SERVER_ERROR
				  //~ });
				//~ }
				//~ else {
				  //~ if (result !=null && result.children === null) result.children = [];
				  //~ if (result1 !=null ) result.children.push(result1);
				  //console.log("Saving parent with children ID", result);
				  //~ result.save();
				  //~ return res.send({
					//~ code: httpResponseCode.EVERYTHING_IS_OK,
					//~ message: httpResponseMessage.SUCCESSFULLY_DONE,
					//~ result: result1
				  //~ });
				//}
			  //~ });

        //~ });
      //~ } else {
       // req.body.parent = null;
        //console.log("IN Else block of Category", req.body);
         /*.then(data => {
          ChildCategory.save();
          ParentCategory.save();
        })*/
        Category.create(req.body, (err, result) => {
         // console.log("RES-CATEGORY", err, result);
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
      //}
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
/** Auther	: KS
 *  Date	: June 18, 2018
 */
/// function to list all category available in  collection
const categoriesActive = (req, res) => {
  Category.find({status:1})
    .populate('parent',['title'])
    .sort({createdAt:-1})
    .exec(function(err, categories) {
        Category.count().exec(function(err, count) {			
          if (err) return next(err)
            return res.json({
                code: httpResponseCode.EVERYTHING_IS_OK,
                message: httpResponseMessage.SUCCESSFULLY_DONE, 
                result: categories,             
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


function populateParents(categories) {
     return Category.populate(categories, { path: "parent" }).then(function(categories) {
     return categories.parent ? populateParents(categories.parent) : Promise.all(categories);
  });
}



/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allCategories111 = (req, res) => {
  var perPage = constant.PER_PAGE_RECORD
  var page = req.params.page || 1;
  Category.find({})
    .populate({ path: "children", model: "Category" })
    .populate({ path: "parent", model: "Category" })
    .skip(perPage * page - perPage)
    .limit(perPage)
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

const getNestedChildren = (arr, parent) => {
    var out = []
    for(var i in arr) {
        if((arr[i].parent != null ?arr[i].parent.toString():arr[i].parent) == (parent != null ?parent.toString():parent)) {
            var children = getNestedChildren(arr, arr[i]._id)
            if(children.length) {
                arr[i].children = children
            }
            out.push(arr[i]);
        }
    }
    return out;
};


/** Auther	: Rajiv kumar
 *  Date	: June 18, 2018
 */
/// function to list all products
const allCategories = (req, res) => {
	// top to bottom query
   Category.find({}).sort({parent: 1})
    .exec(function(err, categories) {
		var newCats = [];
		var index = 0;
		for(var i in categories) {
			//var mycat = Object.assign({}, categories[i]);
			var mycat = Object.assign({}, categories[i]);
			var cat = mycat._doc;
			delete cat.products;
			delete cat.description
			delete cat.createdAt;
			delete cat.updatedAt;
			delete cat.__v;
			delete cat.cat_id;
			delete cat.id;
			delete cat.catParent;
			cat.text = categories[i].title;
			cat.label = categories[i].title;
			cat.value = (categories[i]._id == null )?"0":categories[i]._id.toString();
			cat.data = {_id: categories[i]._id};
			index++;
			newCats.push(cat);
		}
		//console.log('MMMMMMMMMM', newCats);
	  categories = getNestedChildren(newCats, null);
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

//~ function populateChield(category,allCateg) {
    //~ Category.find({'parent':category._id})
		//~ .exec(function(err, ccates) {
			//~ //console.log("populateChield",ccates)
			//~ if(ccates.length !== 0){
				//~ allCateg.push(ccates);
				//~ console.log("populateGrandChield",ccates)
				//~ ccates.forEach(function(cats, index, arr) {
					//~ populateChield(cats,allCateg);
				//~ })
			//~ }else{
				//~ allCateg.push(ccates);
			//~ }

	//~ });
	//~ //console.log("allCateg",allCateg)
	//~ return allCateg
//~ }


/** Auther	: Rajiv Kumar
 *  Date	: June 20, 2018
 *	Description : Function to delete the user
 **/
const deleteCategory = (req, res) => {
  Category.find({parent : req.params.id}, function(err,child){
	  if(child.length == 0 || child == null){
		  Category.findOneAndRemove(req.params.id, (err, result) => {
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
	  }else{
		return res.json({
			message: "You can't delete parebt category!",
			code: httpResponseMessage.BAD_REQUEST
		  });
	  }
 })

};


/** Auther	: Rajiv kumar
 *  Date	: Sept 15, 2018
 */
/// function to simplly get list all category
const listCategory = (req, res) => {
  Category.find({})
    .exec(function(err, categories) {
        if (err) return next(err);
        var newCats = [];
          for(var i in categories) {
            //var mycat = Object.assign({}, categories[i]);
            var mycat = Object.assign({}, categories[i]);
            var cat = mycat._doc;
            delete cat.products;
            delete cat.description
            delete cat.createdAt;
            delete cat.updatedAt;
            delete cat.__v;
            delete cat.cat_id;
            delete cat.id;
            delete cat.catParent;
            cat.label = categories[i].title;
            cat.value = (categories[i]._id == null )?"0":categories[i]._id.toString();
            newCats.push(cat);
          }
        return res.json({
          code: httpResponseCode.EVERYTHING_IS_OK,
          message: httpResponseMessage.SUCCESSFULLY_DONE,
          result: newCats
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
  allCategories,
  listCategory,
  categoriesActive  
};
