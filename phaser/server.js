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

server.lastPlayderID = 0;

io.on('connection',function(socket){
    socket.on('new',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: 360,
            y: 790
        };
        
        socket.broadcast.emit('newplayer', getAllPlayers(socket.player.id));
    });


    socket.on('move_R',function(){
        console.log('move_R');
        socket.broadcast.emit('move_R');
    });

    socket.on('move_L',function(){
        console.log('move_L');
        socket.broadcast.emit('move_L');
    });

    socket.on('stop',function(){
        console.log('stop');
        socket.broadcast.emit('stop_p');
    });
});

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});


function getAllPlayers(my_id){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && (player.id != my_id)) 
            players.push(player);
    });
    console.log(players.length+' online');
    return players;
}