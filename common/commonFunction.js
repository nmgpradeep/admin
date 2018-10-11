const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs'); //FileSystem for node.js
var satelize = require('satelize');
var bcrypt = require('bcrypt-nodejs');
const constant = require('./constant');
// function to get the token form header
const getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length) {
      return parted[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// function to read the html file for email templating
const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	host: constant.SMTP_HOST,
	port: constant.SMTP_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
		user: constant.SMTP_USERNAME, // generated ethereal user
		pass: constant.SMTP_PASSWORD // generated ethereal password
	}
});
module.exports = {
	getToken,
	readHTMLFile,
	transporter
}
