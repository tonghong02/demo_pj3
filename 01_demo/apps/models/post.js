var db = require("../common/database");
var q = require("q");
var helper = require("../helpers/helper");


var conn = db.getConnection();


function getAllPosts(){

	var defer = q.defer();

	var query = conn.query("SELECT * FROM posts", function(error, posts){
		if(error){
			defer.reject(error);
		}
		else{
			// console.log(JSON.stringify(posts));

			for(var i = 0; i < posts.length; i++){
				// posts[i].created_at = helper.formatDateFromSql(posts.created_at.toString());
				// posts[i].updated_at = helper.formatDate(posts.update_at);

				posts[i].created_at = helper.formatDateA(new Date(posts[i].created_at));
				posts[i].updated_at = helper.formatDateA(new Date(posts[i].updated_at));
				// console.log("created_at: " + posts[i].created_at);
			}

			

			defer.resolve(posts);
			
		}

	});
	// console.log(query.sql);

	return defer.promise;

	conn.end();
}


function getAllPostsSearch(keySearch){

	var defer = q.defer();

	var query = conn.query("SELECT * FROM posts WHERE title LIKE '%" + keySearch + "%' ;" , function(error, posts){
		if(error){
			defer.reject(error);
		}
		else{
			// console.log(JSON.stringify(posts));
			for(var i = 0; i < posts.length; i++){
				// posts[i].created_at = helper.formatDateFromSql(posts.created_at.toString());
				// posts[i].updated_at = helper.formatDate(posts.update_at);

				posts[i].created_at = helper.formatDateA(new Date(posts[i].created_at));
				posts[i].updated_at = helper.formatDateA(new Date(posts[i].updated_at));
				// console.log("created_at: " + posts[i].created_at);
			}

			defer.resolve(posts);
			// console.log("posts: " + posts);
		}

	});
	console.log(query.sql);

	return defer.promise;

	conn.end();
}



function addPost(params){

	if(params){
	var defer = q.defer();

		// var query = conn.query('INSERT INTO posts SET ?', params, function (error, result) {
		var sql = "INSERT INTO posts SET `title` = N'" + params.title + "', `content` = N'" + params.content + "', `author` = N'" + params.author + "'," + 
					"`created_at` = '" + helper.formatDate(new Date()) + "' ;";
		var query = conn.query(sql, function (error, result) {
		if(error){
			defer.reject(error);
		}
		else{
			defer.resolve(result);
		}	
	});

	console.log(query.sql);
	
	return defer.promise;

	}	

	conn.end();
	
	return false;
}


function getPostById(id){
	var defer = q.defer();

	var query = conn.query("SELECT * FROM posts WHERE ?",{id: id} , function(error, posts){
		if(error){
			defer.reject(error);
		}
		else{
			console.log(JSON.stringify(posts));

			defer.resolve(posts);
		}

	});
	console.log(query.sql);


	return defer.promise;

	conn.end();


}

function updatePost(params){
	if(params){
	var defer = q.defer();

		var query = conn.query("UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?",[params.title.trim(), params.content.trim(), params.author.trim(), new Date(), params.id.trim()] , function(error, post){
		if(error){
			defer.reject(error);
		}
		else{
			// console.log(JSON.stringify(posts));

			defer.resolve(post);
		}
	});

	console.log(query.sql);
	
	return defer.promise;

	}	x

	conn.end();
	
	return false;
}


function deletePost(id){
	if(id){
		var defer = q.defer();

		var query = conn.query("DELETE FROM posts WHERE ? ",{id: id} , function(error, post){
			if(error){
				defer.reject(error);
			}
			else{
				defer.resolve(post);
			}
		});

	console.log(query.sql);
	
	return defer.promise;

	}	

	// conn.end();
	
	return false;


}



module.exports = {
	getAllPosts: getAllPosts,
	getAllPostsSearch: getAllPostsSearch,
	addPost : addPost,
	getPostById: getPostById,
	updatePost : updatePost,
	deletePost: deletePost
}



