var socketio = require('socket.io');
var express = require("express");
var path    = require("path");
var app     = express();
var fs = require('fs');
var urlencode = require('urlencode');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname + '/public'))); //Serves resources from public folder

var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};
app.use(myLogger)


app.get('/',function(req,res){
    res.sendFile('SwPage.html', { root: path.join(__dirname, 'public') });
});

app.post('/',function(req,res){
    //쿠키 생성
    var login = req.body.login;
    if(login=='1')
    {
        res.cookie('auth',true);
        res.redirect('/game');
    }
});

app.get('/game',function(req,res){
    res.sendFile('index2.html', { root: path.join(__dirname, 'public') });
});

var server = require('http').Server(app);

server.listen(3033,function(){
    console.log('Server running at http://127.0.0.1:3033');
});

var roomlist = new Array();
server.lastPlayderID = 0;
var io = socketio.listen(server);
//socket io 연결
io.sockets.on('connection',function(socket){
    //room join
    //사용자 접속시 room join및 접속한 사용자를 room참여 이누언들에게 알립니다.
    socket.on('join',function() {}unction(data){
        //socket join을 합니다
        socket.join(data.roomname);
        socket.room = data.roomname;
        //room join인원들에게 메세지를 보냅니다
        io.sockets.in(socket.room).emit('join',data.userid);
    });
    //make room
    socket.on('make',function(data){
        roomlist.push(data.roomname);
        console.log(roomlist);
        socket.join(data.roomname);
        socket.room = data.roomname;
        //room이름을 html로 보낸다.
        io.sockets.emit('make',{roomlist:roomlist,userid:data.userid});
    });
    //message
    socket.on('message',function(data){
            io.sockets.in(socket.room).emit('message',{message:data.message,userid:data.userid});
    });
    socket.on('test',function(data){
        console.log('test received');
        socket.player = {
            id: server.lastPlayderID++,
            x: 200,
            y: 200
        };

        io.socket.in(socket.room).emit('newplayer',socket.player);
    });

    socket.on('disconnect',function(){});
});

