var express = require("express");
var path    = require("path");
var app     = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname + '/public'))); //Serves resources from public folder

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(myLogger)

app.get('/',function(req,res){
	res.sendFile('index.html');
});
io.on('connection',function(socket){
    socket.on('test',function(){
        console.log('test received');
    });
});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});
