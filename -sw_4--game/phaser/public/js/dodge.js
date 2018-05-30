var game;

window.onload = function(){
  var gameConfig = {
      type: Phaser.CANVAS,
      width: 720,
      height: 1280,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 0 },
              debug: false
          }
      },
      backgroundColor: '#222222',
      parent: 'phaser-example',
      scene: [game_Scene]
  };
  game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

var player;
var bomb;
var cursors;
var player_pos = 1.57;
var player_speed = 0.05;

var score = 0;
var stage = 1;
var text_score;
var text_stage;

var bomb_pos = 3;
var bomb_speed = 0.03;

var emitter;
var particles;
var deathZone;
var graphics;

var others = {
  id : {},
  player : {},
  isMove : {},
  pos : {}
};

class playGame extends Phaser.Scene
{
  constructor(){  super("PlayGame");  }

  preload ()
  {
      this.load.spritesheet('balls', '../assets/balls.png', { frameWidth: 17, frameHeight: 17 });
      this.load.image('bomb', '../assets/bomb.png');
      this.load.image('button_L','../assets/Lbutton.png');
      this.load.image('button_L_active','../assets/Lbutton_active.png');
      this.load.image('button_R','../assets/Rbutton.png');
      this.load.image('button_R_active','../assets/Rbutton_active.png');
      this.load.atlas('flares', '../assets/flares.png', '../assets/flares.json');
      this.load.json('enemy1', '../assets/enemy1.json');
      this.load.json('enemy2', '../assets/enemy2.json');
      this.load.json('enemy3', '../assets/enemy3.json');
  }

  create ()
  {

  text_stage = this.add.text(50, 50, 'STAGE : 1', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
  text_score = this.add.text(50, 100, 'SCORE : 0', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });

	 player = this.physics.add.image(game.config.width/2, game.config.height/2 + 250, 'balls', Phaser.Math.Between(0,5)).setActive();
	 bomb = this.physics.add.image(game.config.width/2, game.config.height / 8, 'bomb').setActive();
   this.physics.add.collider(player, bomb, this.death, null, this);

	 graphics = this.add.graphics({lineStyle : {width : 2, color : 0x00ff00}});
	 //deathZone = player.getBounds();
   //new Phaser.Geom.Circle(game.config.width/2, game.config.height/2, 10);
   deathZone = {
      contains : function(x, y){
          var hit = player.body.hitTest(x,y);
          if(hit)
          {
                player.setScale(4);
                player.setAlpha(0.2);
                //game END
          }
          return hit;
       }
   }

    particles = this.add.particles('flares');
    emitter = particles.createEmitter(this.cache.json.get('enemy1'));
    emitter.setDeathZone({ type: 'onEnter', source: deathZone });

     var button_L_origin = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L').setScale(0.3);
     var button_L_active = this.add.image(game.config.width/5 ,game.config.height / 8 * 7,'button_L_active').setScale(0.3); button_L_active.visible = false;
     var button_R_origin = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R').setScale(0.3);
     var button_R_active = this.add.image(game.config.width/5 * 4 ,game.config.height / 8 * 7,'button_R_active').setScale(0.3); button_R_active.visible = false;

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
    //graphics.clear();
  	player.x = game.config.width /2 + Math.cos(player_pos) * 250;
  	player.y = game.config.height/2 + Math.sin(player_pos) * 250;

    //graphics.strokeCircleShape(deathZone);
    //deathZone.x = player.x;
    //deathZone.y = player.y;
  	//center + cos(iter) * radius 
  	//player.x += Math.cos(player_pos) * 5;
  	//player.y += Math.sin(player_pos) * 5;


  	bomb_pos += bomb_speed;
  	bomb.y = game.config.height/2 + Math.sin(bomb_pos) * game.config.height / 3 ;

  	for(var i in others.id)
  	{
      	if(others.isMove[i] != 0)
      	{
      		others.pos[i] += (others.isMove[i] * player_speed);
  		  	others.player[i].x = game.config.width /2 + Math.cos(others.pos[i]) * 250;
  			  others.player[i].y = game.config.height/2 + Math.sin(others.pos[i]) * 250;
      	}
      }

  	//if (this.checkOverlap(bomb))
  	{
  		//player.setScale(4);
  		//player.setAlpha(0.2);
  	}
    score++;
    if(score % 10 == 0)
      text_score.setText('SCORE : '+score);
    if(score % 1000 == 0)
       text_stage.setText('STAGE : '+ (++stage));

     if(score == 250)
     {
        particles.destroy();
        particles = this.add.particles('flares');
        emitter = particles.createEmitter(this.cache.json.get('enemy2'));
        emitter.setDeathZone({ type: 'onEnter', source: deathZone });
     }
     else if(score == 500)
     {
        particles.destroy();
        particles = this.add.particles('flares');
        emitter = particles.createEmitter(this.cache.json.get('enemy3'));
        emitter.setDeathZone({ type: 'onEnter', source: deathZone });
     }
     else if(score == 750)
     {
        particles.destroy();
        particles = this.add.particles('flares');
        emitter = particles.createEmitter(this.cache.json.get('enemy1'));
        emitter.setDeathZone({ type: 'onEnter', source: deathZone });
     }
  }

  addNewPlayer(id, x, y)
  {
    others.id[id] = id;
    others.player[id] =  this.add.image(x, y, 'balls', 3);
    others.isMove[id] = 0;
    others.pos[id] = 1.57;
    console.log(others.player);
  }
  move_p_Right(id)
  {
    others.isMove[id] = -1;;
  }
  move_p_Left(id)
  {
    others.isMove[id] = 1;
  }
  stop_p(id)
  {
    others.isMove[id] = 0;
  }
  checkOverlap(_enemy)
  {
    var boundsB = _enemy.getBounds();
    return Phaser.Geom.Rectangle.Overlaps(deathZone, boundsB);
  }
  death()
  {
    player.setScale(4);
    player.setAlpha(0.2);
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