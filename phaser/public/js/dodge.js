var game;

window.onload = function(){
	var gameConfig = {
	    type: Phaser.CANVAS,
	    width: 720,
	    height: 1280,
	    backgroundColor: '#000000',
	    scene: [game_Scene]
	};
	game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);

};

var players={};
var player;
var bomb;
var cursors;
var player_pos = 1.57;
var player_speed = 0.05;
var bomb_pos = 3;
var bomb_speed = 0.03;

var other_players;
var other_players_ismove = 0;
var other_player_pos = 1.57;

class playGame extends Phaser.Scene
{
	constructor(){	super("PlayGame");	}
	preload ()
	{
	    this.load.spritesheet('balls', '../assets/balls.png', { frameWidth: 17, frameHeight: 17 });
	    this.load.image('bomb', '../assets/bomb.png');
	    this.load.image('button_L','../assets/Lbutton.png');
	    this.load.image('button_L_active','../assets/Lbutton_active.png');
	    this.load.image('button_R','../assets/Rbutton.png');
	    this.load.image('button_R_active','../assets/Rbutton_active.png');
	}

	create ()
	{
	  // player = this.add.image(game.config.width/2, game.config.height/2, 'balls', Phaser.Math.Between(0,5));
	   bomb = this.add.image(game.config.width/2, game.config.height / 8, 'bomb');

	   var button_L_origin = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L').setScale(0.3);
	   var button_L_active = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L_active').setScale(0.3);	button_L_active.visible = false;
	   var button_R_origin = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R').setScale(0.3);
	   var button_R_active = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R_active').setScale(0.3);	button_R_active.visible = false;

	  cursors = game.input.keyboard.createCursorKeys();	

	    this.input.on('pointerdown', function (pointer) {
	    	if(pointer.x < game.config.width/2)
	    	{
	    		button_L_active.visible = true;
	    		Client.move_p_Left();
	    	}
	    	else  
	    	{
		    	button_R_active.visible = true;
		    	Client.move_p_Right();
	    	}
	    }, this);
	    this.input.on('pointerup', function (pointer) {
	    		button_L_active.visible = button_R_active.visible =false;  
	    	 Client.stop_p();    
	    }, this);
	    this.input.keyboard.on('keydown_LEFT', function(event){
	    	button_L_active.visible = true;
	    	Client.move_p_Left();
	    }, this);
	    this.input.keyboard.on('keyup_LEFT', function(event){
	    	button_L_active.visible = false;
	    	 Client.stop_p();
	    }, this);
	    this.input.keyboard.on('keydown_RIGHT', function(event){
	    	button_R_active.visible = true;
	    	Client.move_p_Right();
	    }, this);
	    this.input.keyboard.on('keyup_RIGHT', function(event){
	    	button_R_active.visible = false;
	    	 Client.stop_p();
	    }, this);
        Client.new_p();
	}

	/*update ()
	{
		if(game.input.activePointer.isDown)
		{
			if(game.input.activePointer.x < game.config.width/2)
	    		player_pos += player_speed;
			else
	    		player_pos -= player_speed;
		}

	    if (cursors.right.isDown)
	    {
	        player_pos -= player_speed;
	    }
	    else if(cursors.left.isDown)
	    {
	    	player_pos += player_speed;
	    }
	    players[0].x = game.config.width /2 + Math.cos(player_pos) * 150;
		players[0].y = game.config.height/2 + Math.sin(player_pos) * 150;

	    //center + cos(iter) * radius
	    //player.x += Math.cos(player_pos) * 5;
	    //player.y += Math.sin(player_pos) * 5;


		bomb_pos += bomb_speed;
	 	bomb.y = game.config.height/2 + Math.sin(bomb_pos) * game.config.height / 3 ;

	 	if(players[0].x < bomb.x+20 && players[0].x > bomb.x-20)
	    {
	    	if(players[0].y < bomb.y+20 && players[0].y > bomb.y-20)
	    	{
                players[0].setScale(4);
                players[0].setAlpha(0.2);
	    	}
	    }
	    //if(other_players_ismove != 0)
	    //{
	    //	other_player_pos += (other_players_ismove * player_speed);
	    //	other_players.x = game.config.width /2 + Math.cos(other_player_pos) * 150;
		//	other_players.y = game.config.height/2 + Math.sin(other_player_pos) * 150;
	    //}
	}*/

	move_p_Right()
	{
		other_players_ismove = -1;
	}
	move_p_Left()
	{
		other_players_ismove = 1;
	}
	stop_p()
	{
		other_players_ismove = 0;
	}
	addNewPlayer(id,x,y)
	{
		console.log('add');
		players[id]= this.add.image(x, y, 'balls', Phaser.Math.Between(0,5));
		console.log(players);
	}

	removePlayer(id){
		console.log('remove one player');
		players[id].destroy();
		delete players[id];
	}
}

var game_Scene = new playGame();


// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}