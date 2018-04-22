var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.socket.on('newplayer',function(data){
	console.log(data.id + ' '+data.x+' '+data.y);
    game_Scene.new_p();
});