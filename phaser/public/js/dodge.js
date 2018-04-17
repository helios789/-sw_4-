var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var player;
var cursors;
var count = 0;
var player_iter = 1.57;
var player_direct = 1;
var bomb;
var bomb_speed = 10;
var game = new Phaser.Game(config);

function preload ()
{
    //this.load.image('ball', '../assets/star.png');
    this.load.spritesheet('balls', '../assets/balls.png', { frameWidth: 17, frameHeight: 17 });
    this.load.image('bomb', '../assets/bomb.png')
    this.load.image('arrow','../assets/arrow.jpg')
}

function create ()
{
   player = this.add.image(400,300, 'balls', Phaser.Math.Between(0,5));
    
 
   cursors = game.input.keyboard.createCursorKeys();
   bomb = this.add.image(400,100,'bomb');
   rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });
}

function update ()
{
	if(game.input.activePointer.isDown)
	{
		if(game.input.activePointer.x < 400)
		{
			player_direct = 1;
    		player_iter += 0.05;
		}
		else
		{
			player_direct = -1;
    		player_iter -= 0.05;
		}rt.clear();
	}


 	if(bomb.y > 560 || bomb.y < 40)
 		bomb_speed *= -1;
 	bomb.y += bomb_speed;

 	if(player.x < bomb.x+20& player.x > bomb.x-20)
    {
    	if(player.y < bomb.y+20 && player.y > bomb.y-20)
    	{
    		player.setScale(4);
    		player.setAlpha(0.2);
    	}
    }
	if (cursors.left.isDown && cursors.right.isDown)
    {
    	draw();
    	if(player_direct == 1)
    	{
      		player_iter += 0.1;
    	}
    	else
    	{
    		player_iter -= 0.1;
    	}    	
    }
    else if (cursors.right.isDown)
    {
       	player_direct = (-1);
        player_iter -= 0.05;
		rt.clear();
    }
    else if(cursors.left.isDown)
    {
    	player_direct = 1;
    	player_iter += 0.05;
		rt.clear();
    }

    player.x = 400 + Math.cos(player_iter) * 100;
	player.y = 300 + Math.sin(player_iter) * 100;
    //center + cos(iter) * radius 
    //player.x += Math.cos(player_iter) * 5;
    //player.y += Math.sin(player_iter) * 5;

}

function draw(){
	if(count > 3){
		rt.clear();
		count = 0;
	}
	rt.globalAlpha = 0.2;
	//rt.globalTint = ((0.5 + Math.random()) * 0xFFFFFF << 0);

	rt.draw(player.texture, player.frame, player.x-13, player.y-13);
    rt.restore();
    count++;
}
