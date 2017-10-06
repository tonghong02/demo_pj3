var express = require('express');

// var formidable = require('formidable'); // upload file

// var bodyParser = require('body-parser');
// var multiparty  = require('multiparty');
// var fs = require('fs');

// var multer  = require('multer')
// var upload = multer({ dest: 'public/uploads/' })

var router = express.Router();


var userModel = require("../models/user");
var postModel = require("../models/post");

var helper = require("../helpers/helper");

// *** BLOG ADMIN ***

router.get('/', function(req, res){
	// res.json({"message" : "This is admin"});
	// res.render("admin/dashboard", {data: {error: false}});

	if(req.session.user){
		var data = postModel.getAllPosts();

		data.then(function(posts){

			var data = {
				posts: posts,

				error: false
			};
			res.render("admin/dashboard", {data: data, email: req.session.user.email});

		}).catch(function(error){
			res.render("admin/dashboard", {data: {error: "Get post data is error"}});
		});
	}
	else{
		res.redirect("/admin/signin");
	}
	
});

// // *** UPLOAD IMAGE ***
// // only one img

// router.get("/upload", function(req, res){
// 	res.json({"message": "upload success!!"});

// })


// router.post('/upload', upload.any(), function(req, res){

//   	res.send(req.files);

//  //  	[
// 	// 	{
// 	// 	"fieldname": "upload",
// 	// 	"originalname": "18578482_827940947361068_1824687333_n.png",
// 	// 	"encoding": "7bit",
// 	// 	"mimetype": "image/png",
// 	// 	"destination": "public/uploads/",
// 	// 	"filename": "8ce1b2c7cf41217c8d8d6a3f1f5a78fe",
// 	// 	"path": "public/uploads/8ce1b2c7cf41217c8d8d6a3f1f5a78fe",
// 	// 	"size": 401461
// 	// 	}
// 	// ]

// });

// // var storage = multer.diskStorage({
// //   destination: function (request, file, callback) {
// //     callback(null, '/example/uploads');
// //   },
// //   filename: function (request, file, callback) {
// //     console.log(file);
// //     callback(null, file.originalname)
// //   }
// // });

// // var upload = multer({storage: storage}).array('photo', 5);

// // app.get('/', function(resuest, response) {
// //   response.sendFile('/example/index.html');
// // });

// // app.post('/upload', function(request, response) {
// //   upload(request, response, function(err) {
// //     if(err) {
// //       console.log('Error Occured');
// //       return;
// //     }
// //     // request.files is an object where fieldname is the key and value is the array of files 
// //     console.log(request.files);
// //     response.end('Your Files Uploaded');
// //     console.log('Photo Uploaded');
// //   })
// // });






// // *** SIGN UP ***

router.get("/signup", function(req, res){
	res.render("signup", {data: {}});
})


router.post("/signup", function(req, res){
	var user = req.body;

	if(user.email.trim().length == 0){
		res.render("signup", {data: {error: "Email is required!"}});
	}

	if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
		res.render("signup", {data: {error: "Password is not match!"}});
	}

	// insert DB

	console.log("user.passwd = " + user.passwd);
	var passwd = helper.hashPasswd(user.passwd);


	user = {

		email: user.email,
		password : passwd,
		first_name: user.firstname,
		last_name: user.lastname
	};


	var result = userModel.addUser(user);

	result.then(function(data){
		// res.json({message: "Insert success!!!"});

		res.redirect("/admin/signin");
	})
	.catch(function(error){
		res.render("signup", {data: {error: "Error"}} );
	});
})


// ***  SEARCH ***

router.post("/", function(req, res){
	var params = req.body;

	var result = postModel.getAllPostsSearch(params.search);

	console.log("result.length = " + result);

	result.then(function(posts){
		// res.json({message: "Insert success!!!"});

		var data = {
			posts: posts,
			error: false
		}
		res.render("admin/dashboard", {data: data, email: req.session.user.email});
	})
	.catch(function(error){
		res.render("admin/dashboard", {data: {error: "Not found result match!"}} );
	});

});

// *** SIGN IN ***

router.get("/signin", function(req, res){
	req.session.destroy();
	res.render("signin", {data : {}});
});


router.post("/signin", function(req, res){
	var params = req.body;

	if(params.email.trim().length == 0){
		res.render("signin", {data : {error: "Please enter an email!!! "}});
	}

	else{
		var result = userModel.getUserByEmail(params.email);

		console.log("result.length = " + result);

		if(result){
			result.then(function(datas){

				console.log("datas.length = " + datas.length);

				if(datas.length == 0){
					res.render("signin", {data: {error: "Email is wrong!"}});
				}

				else{

					var data = datas[0];
					console.log("data.password = " + data.password);
					console.log("params.passwd = " + params.passwd);

					var status = helper.comparePasswd(params.passwd, data.password);

					console.log("status = " + status);

					if(!status){
						res.render("signin", {data: {error: "Password is wrong!"}});
					}
					else{
						// req.expressS
						req.session.user = data;
						console.log(req.session.user);
						res.redirect("/admin");
					}
				}
				
			});
		}
		else{
			res.render("signin", {data: {error : "User not exists!"}});
		}
	}
})


// *** NEW POST ***

router.get("/post/new", function(req, res){
	if(req.session.user){
		res.render("admin/post/new", {data: {error: false}});

	}

	else{
		res.redirect("/admin/signin");
	}

});

router.post("/post/new", function(req, res){
	var params = req.body;


	if(params.title.trim().length == 0){
		res.render("admin/post/new", {data : {error: "Title not empty!!! "}});
	}

	else if(params.content.trim().length == 0){
		res.render("admin/post/new", {data : {error: "content not empty!!! "}});
	}

	else if(params.author.trim().length == 0){
		res.render("admin/post/new", {data : {error: "author not empty!!! "}});
	}

	else{
		var now = new Date();

		var dateFormat = helper.formatDate(now);

		// console.log("now = " + now);
		console.log("format = " + dateFormat);

		// console.log(formatDate(new Date()));

		// params.created_at = now;
		// params.updated_at = now;

		params.created_at = dateFormat;
		params.updated_at = dateFormat;

		console.log(JSON.stringify(params));

		// 2017-09-28T16:07:51.820Z

		var data = postModel.addPost(params);

		data.then(function(result){

			res.redirect("/admin");


		}).catch(function(error){

			res.render("admin/post/new", {data: {error: "Could not insert post!!"}});
		});
	}
});


// *** GET ID POST ***

router.get("/post/edit/:id", function(req, res){

	if(req.session.user){
		var params = req.params;

		var id = params.id;

		var data = postModel.getPostById(id);

		if(data){
			data.then(function(posts){
				post = posts[0];

				var data = {
					post: post,
					error: false
				};

				res.render("admin/post/edit", {data: data});

			}).catch(function(error){

				var data = {
					error: "Could not post by " + id
				};

				res.render("admin/post/edit", {data: data});
			})
		}

		else{
			var data = {
				error: "Could not post by " + id
			};

				res.render("admin/post/edit", {data: data});
		}
	}
	else{
		res.redirect("/admin/signin");
	}
});


// *** PUT INFO EDIT POST ***

router.put("/post/edit", function(req, res){

	var params = req.body;

	var data = postModel.updatePost(params);

	if(!data){
		res.json({status_code: 500});

	}

	else{
		data.then(function(post){
			res.json({status_code: 200});

		}).catch(function(error){
			res.json({status_code: 500});
		});
	}

});

// *** DELETE POST BASE ID ***

router.delete("/post/delete", function(req, res){
	// lay duoc id tu ajax khi gui du lieu data den /post/delete
	var id = req.body.id;

	var data = postModel.deletePost(id);

	if(!data){
		res.json({status_code: 500});
	}
	else{
		data.then(function(post){
			res.json({status_code: 200});
		}).catch(function(error){
			es.json({status_code: 500});
		});
	}
});


// *** redirect in nav (user, post) ***

router.get("/post", function(req, res){
	if(req.session.user){
		res.redirect("/admin");
	}
	else{
		res.redirect("/admin/signin");
	}
	
});

router.get("/user", function(req, res){

	if(req.session.user){
		var data = userModel.getAllUsers();

		if(data){
			data.then(function(users){
				var data = {
					users : users,
					error: false
				}

				res.render("admin/user", {data: data});
			}).catch(function(error){
				var data = {
					error: "Could not get user info!"
				}
				res.render("admin/user", {data: data});
			})
		}

	}
	else{
		res.redirect("/admin/signin");
	}
})















// ***   ***



module.exports = router;