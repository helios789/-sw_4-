var Client = {};
Client.socket = io.connect();

Client.new_p = function(){
    Client.socket.emit('new');
    console.log('ask new player');
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
    	game_Scene.addNewPlayer(data.id,data.x,data.y);
    	console.log('newplayer');
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i <data.length; i++){
        game_Scene.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('remove', function(id){
    game_Scene.removePlayer(id);
});

Client.socket.on('move_R',function(){
    game_Scene.move_p_Right(d);
});
Client.socket.on('move_L',function(){
    game_Scene.move_p_Left();
});

Client.socket.on('stop_p',function(){
    game_Scene.stop_p();
});