var PLAY = 1;
var END = 0;
var gameState = PLAY;
var robot, robot_running, robot_jumping, robot_collided;
var ground, background1, invisibleGround, groundImage, backgroundImage; 
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var gameOver,restart;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var dino, dino_running, dino_jumping;

function preload(){
 robot_running = loadAnimation("Run1.png","Run2.png","Run3.png","Run4.png");
 robot_jumping = loadAnimation("Jump1.png","Jump2.png");
 robot_collided = loadAnimation("Dead9.png");
  
 groundImage = loadImage("ground.png");
 
 dino_running = loadAnimation("Dinorun1.png", "Dinorun2.png", "Dinorun3.png", "Dinorun4.png", "Dinorun5.png", "Dinorun6.png", "Dinorun7.png");
 dino_jumping = loadAnimation("DinoJump1.png","DinoJump2.png","DinoJump3.png","DinoJump4.png");

 obstacle1 = loadImage("Barrel1.png");
 obstacle2 = loadImage("Barrel2.png");
 obstacle3 = loadImage("Saw.png");
 obstacle4 = loadImage("Spike.png");

 restartImg = loadImage("restartbutton.png");
 gameOverImg = loadImage("Gameover.png");
 jumpSound = loadSound("Jump_sound.wav");
 dieSound = loadSound("diesound.mp3");
}

function setup() {
 createCanvas(600, 200);
 
 var message = "Test message";

 robot = createSprite(150, 160, 20, 50);
 robot.addAnimation("running", robot_running);
 robot.addAnimation("jumping", robot_jumping);
 robot.addAnimation("collided", robot_collided);

 robot.scale = 0.5;

 dino = createSprite(50,160,20,50);
 dino.addAnimation("running", dino_running);
 dino.addAnimation("jumping", dino_jumping);

 ground = createSprite(200,180,400,20);
 ground.addImage("ground", groundImage);
 ground.x = ground.width /2;


 gameOver = createSprite(300,100);
 gameOver.addImage(gameOverImg);

 restart = createSprite(300,140);
 restart.addImage(restartImg);

 gameOver.scale = 0.5;
 restart.scale = 0.5;
 
 invisibleGround = createSprite(200,190,400,10);
 invisibleGround.visible = false;

 obstaclesGroup = new Group();

 robot.setCollider("rectangle", 0,0, robot.width,robot.height);
 robot.debug = false
 
 dino.setCollider("rectangle", 0,0, dino.width,dino.height);

 score = 0;
}

function draw() {
  background(255, 204, 100);
  
    text("Pontuação: "+ score, 500,50);
 
    if(gameState === PLAY){

        gameOver.visible = false;
        restart.visible = false;
        
        ground.velocityX = -(4 + 3* score/100)
       
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3*score/100);
        
        robot.changeAnimation("running", robot_running);
        dino.changeAnimation("running", dino_running);
    
        if (ground.x < 0){
          ground.x = ground.width/2;
        }
        
       
        if(keyDown("space")&& robot.y >= 150) {
            robot.velocityY = -12;
            jumpSound.play();
        }
        
     
    robot.velocityY = robot.velocityY + 0.8;
    dino.velocityY = dino.velocityY + 0.8;

    spawnObstacles();
    
    if(obstaclesGroup.isTouching(robot)){
        gameState = END
        dino.x = 150;
        dino.y = 160;
    }

    if(dino.isTouching(robot)){
        
      jumpSound.play();
      gameState = END;
      dieSound.play();
    
  }
 
    if(obstaclesGroup.isTouching(dino)){
        
      jumpSound.play();
      dino.velocityY = -12;
    }

  }
     else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;
       
        robot.changeAnimation("collided", robot_collided);
      
       
       
        ground.velocityX = 0;
        robot.velocityY = 0;
        dino.velocityY = 0;

      obstaclesGroup.setLifetimeEach(-1);
     
       
       obstaclesGroup.setVelocityXEach(0);
  
     }
     
  robot.collide(invisibleGround);
  dino.collide(invisibleGround);

  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
   
}

  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
  
    dino.x = 50;
    obstaclesGroup.destroyEach();
    score = 0;
  }

  function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(600,165,10,40);
       obstacle.debug = false;
      obstacle.velocityX = -(6 + 3*score/100);
      
       //gerar obstáculos aleatórios
       var rand = Math.round(random(1,4));
       switch(rand) {
         case 1: obstacle.addImage(obstacle1);
                 break;
         case 2: obstacle.addImage(obstacle2);
                 break;
         case 3: obstacle.addImage(obstacle3);
                 break;
         case 4: obstacle.addImage(obstacle4);
                 break;
       }
      
       //atribua dimensão e tempo de vida aos obstáculos           
       obstacle.scale = 0.5;
       obstacle.lifetime = 300;
      
      //adicione cada obstáculo ao grupo
       obstaclesGroup.add(obstacle);
    }
   }
  