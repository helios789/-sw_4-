var game;
window.onload = function(){
	var gameConfig = {
	    type: Phaser.CANVAS,
	    width: 720,
	    height: 1280,
	    backgroundColor: '#222222',
	    scene: [playGame]
	};
	game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
    
    Client.sendTest();
}

var player;
var bomb;
var cursors;
var player_pos = 1.57;
var player_speed = 0.05;
var bomb_pos = 3;
var bomb_speed = 0.03;

class playGame extends Phaser.Scene
{
	constructor(){	super("PlayGame");	}

	preload ()
	{
	    this.load.spritesheet('balls', '../assets/balls.png', { frameWidth: 17, frameHeight: 17 });
	    this.load.image('bomb', '../assets/bomb.png')
	    this.load.image('button_L','../assets/Lbutton.png')
	    this.load.image('button_L_active','../assets/Lbutton_active.png')
	    this.load.image('button_R','../assets/Rbutton.png')
	    this.load.image('button_R_active','../assets/Rbutton_active.png')
	}

	create ()
	{
	   player = this.add.image(game.config.width/2, game.config.height/2, 'balls', Phaser.Math.Between(0,5));
	   bomb = this.add.image(game.config.width/2, game.config.height / 8, 'bomb');

	   var button_L_origin = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L').setScale(0.3);
	   var button_L_active = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L_active').setScale(0.3);	button_L_active.visible = false;
	   var button_R_origin = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R').setScale(0.3);
	   var button_R_active = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R_active').setScale(0.3);	button_R_active.visible = false;

	  cursors = game.input.keyboard.createCursorKeys();	

	    this.input.on('pointerdown', function (pointer) {
	    	if(pointer.x < game.config.width/2)
	    		button_L_active.visible = true;
	    	else   
		    	button_R_active.visible = true;
	    }, this);
	    this.input.on('pointerup', function (pointer) {
	    		button_L_active.visible = button_R_active.visible =false;      
	    }, this);
	    this.input.keyboard.on('keydown_LEFT', function(event){
	    	button_L_active.visible = true;
	    }, this);
	    this.input.keyboard.on('keyup_LEFT', function(event){
	    	button_L_active.visible = false;
	    }, this);
	    this.input.keyboard.on('keydown_RIGHT', function(event){
	    	button_R_active.visible = true;
	    }, this);
	    this.input.keyboard.on('keyup_RIGHT', function(event){
	    	button_R_active.visible = false;
	    }, this);
	}

	update ()
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
	    player.x = game.config.width /2 + Math.cos(player_pos) * 150;
		player.y = game.config.height/2 + Math.sin(player_pos) * 150;
	    //center + cos(iter) * radius 
	    //player.x += Math.cos(player_pos) * 5;
	    //player.y += Math.sin(player_pos) * 5;


		bomb_pos += bomb_speed;
	 	bomb.y = game.config.height/2 + Math.sin(bomb_pos) * game.config.height / 3 ;

	 	if(player.x < bomb.x+20& player.x > bomb.x-20)
	    {
	    	if(player.y < bomb.y+20 && player.y > bomb.y-20)
	    	{
	    		player.setScale(4);
	    		player.setAlpha(0.2);
	    	}
	    }
	}
}

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