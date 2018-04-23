var Client = {};
Client.socket = io.connect();

Client.new_p = function(){
    Client.socket.emit('new');
};

Client.move_p_Right = function(){
    Client.socket.emit('move_R');
};
Client.move_p_Left = function(){
    Client.socket.emit('move_L');
};
Client.stop_p = function(){
    Client.socket.emit('stop');
};

Client.socket.on('newplayer',function(data){
	if(data.length != 0)
	{
    	game_Scene.new_p();
    	console.log('newplayer');
	}
});

Client.socket.on('move_R',function(){
    game_Scene.move_p_Right();
});
Client.socket.on('move_L',function(){
    game_Scene.move_p_Left();
});

Client.socket.on('stop_p',function(){
    game_Scene.stop_p();
});