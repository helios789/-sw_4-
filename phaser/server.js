var express = require("express");
var path    = require("path");
var app     = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname + '/public'))); //Serves resources from public folder
/*
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(myLogger)
*/
app.get('/',function(req,res){
	res.sendFile("index2.html", { root: path.join(__dirname, 'public') })
});

server.lastPlayderID = 1;

io.on('connection',function(socket){
    socket.on('new_player',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: 360,
            y: 890
        };
     	console.log('id : '+socket.player.id+" player create!");      
        socket.broadcast.emit('new_player', socket.player);
     	socket.emit('get_allplayer', getAllPlayers(socket.player));
 
    });
    socket.on('move_R',function(){
        console.log('move_R');
        socket.broadcast.emit('move_R', socket.player);
    });

    socket.on('move_L',function(){
        console.log('move_L');
        socket.broadcast.emit('move_L', socket.player);
    });

    socket.on('stop',function(){
        console.log('stop');
        socket.broadcast.emit('stop_p', socket.player);
    });

    socket.on('death',function(){
        console.log('death');
        socket.broadcast.emit('death', socket.player);
    });
});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});

function getAllPlayers(self){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && player.id != self.id) 
            players.push(player);
    });
    return players;
}