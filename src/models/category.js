"use strict";
var categoryConstant = require("./categoryConstant");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require("bcrypt-nodejs");

var CategorySchema = new Schema(
  {
    ...categoryConstant,
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category"
      }
    ],
    parent: null || {
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Category", CategorySchema);
