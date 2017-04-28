'use strict';
var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
/* GET users listing. */
router.get('/', function(req, res, next) {
	var data = 'Hello, Node.js\nhey';
	fs.writeFile('C:\\Users\\yunyou\\Desktop\\output.txt', data, function (err) {
	    if (err) {
	        console.log(err);
	    } else {
	        console.log('ok.');
	    }
	});
	res.send('respond with a resource');
});
router.post('/writeFile',function(req,res,next){
	let data=req.body.data;
	let filepath=path.resolve(__dirname, '../public/output.brp');
	fs.writeFile(filepath, data, function (err) {
	    if (err) {
	        console.log(err);
	    } else {
	        console.log('ok.');
	    }
	});
	/*fs.writeFile('../public/output.brp', data, function (err) {
	    if (err) {
	        console.log(err);
	    } else {
	        console.log('ok.');
	    }
	});*/
});
module.exports = router;
