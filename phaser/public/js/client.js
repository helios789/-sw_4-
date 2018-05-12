var Client = {};
Client.socket = io.connect();

Client.new_p = function(){
    Client.socket.emit('new_player');
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



Client.socket.on('new_player',function(new_player){
    game_Scene.addNewPlayer(new_player.id, new_player.x, new_player.y);
    console.log('newplayer : '+new_player.id);
});

Client.socket.on('get_allplayer',function(other_players){
    console.log('total player : ' + other_players.length);
    for(var i = 0; i < other_players.length; i++)
    {
        game_Scene.addNewPlayer(other_players[i].id, other_players[i].x, other_players[i].y);
    }

    Client.socket.on('move_R',function(player){
        game_Scene.move_p_Right(player.id);
    });
    Client.socket.on('move_L',function(player){
        game_Scene.move_p_Left(player.id);
    });

    Client.socket.on('stop_p',function(player){
        game_Scene.stop_p(player.id);
    });
});
