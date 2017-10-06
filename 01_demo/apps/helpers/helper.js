
var bcrypt = require('bcrypt');
var config = require('config');


function hashPasswd(passwd){
	var saltRounds = config.get("salt");

	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(passwd, salt);

	return hash;
}

function comparePasswd(passwd, hash){
	return bcrypt.compareSync(passwd, hash); 
}


function addZero(data){
  if(data.length == 1){
    data = "0" + data;
  }
  return data;
}


function formatDateA(date) {
  var monthNames = [
    "01", "02", "03",
    "04", "05", "06", "07",
    "08", "09", "10",
    "11", "12"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  var s = addZero(date.getSeconds());

  return day + '-' + monthNames[monthIndex] + '-' + year + " " + h + ":" + m + ":" + s;
}


function formatDate(date) {
  var monthNames = [
    "01", "02", "03",
    "04", "05", "06", "07",
    "08", "09", "10",
    "11", "12"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var h = addZero(date.getHours());
  var m = addZero(date.getMinutes());
  var s = addZero(date.getSeconds());

  return year + '-' + monthNames[monthIndex] + '-' + day + " " + h + ":" + m + ":" + s;
}


module.exports = {

	hashPasswd : hashPasswd,
	comparePasswd: comparePasswd,
	formatDateA: formatDateA,
	formatDate : formatDate

}