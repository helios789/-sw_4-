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
	res.sendFile("index2.html", { root: path.join(__dirname, 'public') })
});

server.lastPlayderID = 0;

io.on('connection',function(socket){
    socket.on('test',function(){
        console.log('test received');
        socket.player = {
            id: server.lastPlayderID++,
            x: 200,
            y: 200
        };
    socket.broadcast.emit('newplayer',socket.player);
    });


    socket.on('move',function(){
        console.log('move');
        socket.broadcast.emit('move_p');

    });

    socket.on('stop',function(){
        console.log('stop');
        socket.broadcast.emit('stop_p');
    });
});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});
