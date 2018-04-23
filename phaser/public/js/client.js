var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.move_p = function(){
    Client.socket.emit('move');
};
Client.stop_p = function(){
    Client.socket.emit('stop');
};


Client.socket.on('newplayer',function(data){
	console.log(data.id + ' '+data.x+' '+data.y);
    game_Scene.new_p();
});
Client.socket.on('move_p',function(){
    game_Scene.move_p();
});
Client.socket.on('stop_p',function(data){
    game_Scene.stop_p();
});