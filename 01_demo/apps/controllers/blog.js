var express = require('express');

var router = express.Router();

// var postModel = require("../models/post");


router.get('/', function(req, res){
	res.json({"message" : "This is blog page"});

	// var data = postModel.getAllPosts();

	// if(data){
	// 	data.then(function(posts){
	// 		var results = {
	// 			posts: posts,
	// 			error: false
	// 		};

	// 		res.render("blog/index", {data: results});
	// 	}).catch(function(error){
	// 		res.render("blog/index", {data: {error: "Could not get posts data!"}});
	// 	})
	// }

	// res.render("blog/index");
});

// router.get("/post/:id", function(req, res){
// 	var params = req.params;

// 	var id = params.id;
// 	console.log("id post = " + id);
	
// 	var data = postModel.getPostById(id);


// 	data.then(function(posts){
// 		var post = posts[0];

// 		var result = {
// 			post : post,
// 			error: false
// 		}

// 		res.render("blog/post", {data: result});
// 	}).catch(function(error){
// 		res.render("blog/post", {data: {error: "Could not post with id = "}});
// 	})
// });

// router.get("/about", function(req, res){

// 	res.render("blog/about");
// })



module.exports = router;