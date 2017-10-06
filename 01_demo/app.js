
var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var expressSession = require('express-session');


var app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// extended = true: de lay duoc body trong form 

app.set('trust proxy', 1) // trust first proxy
app.use(expressSession({
  secret: config.get("secret-key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));	

// cookie co secure : false ddeer cos theer save dduwowcj duwx lieeuj khacs vaof



app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

// static folder
app.use("/static", express.static(__dirname + "/public"));


// __dirname: tra ve thu muc chu app.js => folder la 01_demo
var controllers = require(__dirname + "/apps/controllers");

app.use(controllers);



var host = config.get("server.host");
var port = config.get("server.port");



app.listen(port, host, function(){
	console.log('server is running on port ', port);
})


