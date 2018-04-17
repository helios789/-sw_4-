var express = require("express");
var path    = require("path");
var app     = express();

app.use(express.static(path.join(__dirname + '/public'))); //Serves resources from public folder

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(myLogger)


app.get('/',function(req,res){
	res.sendFile('index.html');
});



app.listen(3000, function(){
	console.log('Server start');
}); 