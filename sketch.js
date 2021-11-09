const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var queenbee, queenbeeImg
var gravestoneimg
var breakButton;
var backgroundImage;

var stones = [];
var collided = false;
function preload() {
  queenbeeImg = loadImage("Queen_Bee.gif");''
  gravestoneimg = loadImage("grave strone.png")

  backgroundImage = loadImage("junle.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(30, { x: 50, y: height / 2 - 140 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  queenbee = createSprite(width / 2, height - 100, 50, 50);
  queenbee.addImage(queenbeeImg);
  queenbee.addImage("dead", gravestoneimg);

  queenbee.scale = 0.7;
  queenbee.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    
    var distance = dist(queenbee.position.x, queenbee.position.y, pos.x, pos.y);

    if (distance <= 50) {
      queenbee.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      queenbee.changeImage("dead");
      collided = true;
    }

  }

  if (queenbee.position.x >= width - 300 && !collided) {
    queenbee.velocityX = -10;
  }

  if (queenbee.position.x <= 300 && !collided) {
    queenbee.velocityX = 10;
  }

  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
