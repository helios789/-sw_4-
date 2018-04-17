var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var urlencode = require('urlencode');

var app = express();
var server = http.createServer(function(request,response){
	fs.readFile('SwPage.html',function(error,data){
		response.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
		response.end(data);
	});
}).listen(3033,function(){
	console.log('Server Running at http://127.0.0.1:3033');
});
var roomlist = new Array();

var io = socketio.listen(server);
//socket io 연결
io.sockets.on('connection',function(socket){
	//room join
	//사용자 접속시 room join및 접속한 사용자를 room참여 이누언들에게 알립니다.
	socket.on('join',function(data){
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
	socket.on('message',function(message){
			io.sockets.in(socket.room).emit('message',message);
	});
	socket.on('disconnect',function(){});
});