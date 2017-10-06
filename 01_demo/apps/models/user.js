
var db = require("../common/database");
var q = require("q");


var conn = db.getConnection();

function getAllUsers(){

	var defer = q.defer();

	var query = conn.query("SELECT * FROM users", function(error, users){
		if(error){
			defer.reject(error);
		}
		else{
			// console.log(JSON.stringify(users));

			defer.resolve(users);
			// console.log("posts: " + users);
		}

	});
	console.log(query.sql);

	return defer.promise;

	conn.end();
}



function addUser(user){
	if(user){
		var defer = q.defer();
		conn.query("SELECT * FROM users WHERE email = '" + user.email + "' ;", function(error, results){

			if(error){
				defer.reject(error);
			}

			else if(results.length > 0){
				console.log("email has existed in Db!");
				defer.reject(error);
			}
			else{
				var query = conn.query('INSERT INTO users SET ?', user, function (error, results) {
					if(error){
						defer.reject(error);
					}
					else{
						defer.resolve(results);
					}	
				});

				console.log(query.sql);
			}

		} );
		
		return defer.promise;

		conn.end();

	}
	return false;
}


function getUserByEmail(email){
	if(email){
		var defer = q.defer();

		var query = conn.query("SELECT * FROM users WHERE ? ", {email: email}, function(error, results){
			console.log("results.length" + results.length);
			if(error){
				defer.reject(error);
			}

			else{
				console.log("results.length = " + results.length);
				if(results.length == 0){
					defer.resolve(results);
				}

				else{
					defer.resolve(results);
				}
			}

		});
		console.log(query.sql);

		return defer.promise;

		conn.end();
	}
	return false;

}




module.exports = {
	getAllUsers : getAllUsers,
	addUser : addUser,
	getUserByEmail: getUserByEmail
};