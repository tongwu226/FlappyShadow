var head, body, leftWing, rightWing, wingWidth;
var flap;
var wingWidthL, wingWidthR;
var turnAngle = 50;
var flightSpeed = 10;
var flightMax = 15;
var test;
let kinectron = null; //track body
let LeftHandx, LeftHandy, RightHandx, RightHandy;
var BodySize = 1;
var d;
var s;
var Angle;
//Paper.js adaption
var br = 1;
//小尾巴
var RADIUS = 70;
var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = 1;
var RADIUS_SCALE_MAX = 1.5;
var QUANTITY = 25;
var context;
var particles;

var cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10, cloud11, cloud12;
var cloudMotion;
//小尾巴1


function preload() {
  head = loadImage('bird-head.png');
  body = loadImage('bird-body.png');
  leftWing = loadImage('bird-left-wing.png');
  rightWing = loadImage('bird-right-wing.png');

     cloud1 = loadImage('cloud1.png');
    cloud3 = loadImage('cloud3.png');
    cloud4 = loadImage('cloud4.png');
    cloud5 = loadImage('cloud5.png');
    cloud8 = loadImage('cloud8.png');
    cloud9 = loadImage('cloud9.png');
    cloud12 = loadImage('cloud12.png');
}


function setup() {
  console.log("p5 running");
  frameRate(30);
  createCanvas(windowWidth,windowHeight);
  flap = 1;
  cloudMotion = 0;
  var IPaddress = "172.16.216.147";
  kinectron = new Kinectron(IPaddress);
  kinectron.makeConnection();
  kinectron.startMultiFrame(["body", "joints"], bodyTracked);
}
function bodyTracked(bodies) {
  var closestBody = getClosestBodyIndex(bodies.body)
  if (closestBody < 0) return

  var body = bodies.body[closestBody]

  // console.log(body.joints[kinectron.SPINEMID].cameraZ);
  BodySize = (4 - body.joints[kinectron.SPINEMID].cameraZ) / 4;


  //the body variable contains the payload of all the kinect info
  LeftHandx = body.joints[kinectron.HANDLEFT].depthX;
  LeftHandy = body.joints[kinectron.HANDLEFT].depthY;
  LeftHandy = LeftHandy * windowHeight;
  LeftHandx = LeftHandx * windowWidth;
  RightHandx = body.joints[kinectron.HANDRIGHT].depthX;
  RightHandy = body.joints[kinectron.HANDRIGHT].depthY;
  RightHandx = RightHandx * windowWidth;
  RightHandy = RightHandy * windowWidth;
}



function draw() {
  clear();
  if (cloudMotion < windowHeight + 7500) {
        cloudMotion = cloudMotion + 15;
        image(cloud1, 0, cloudMotion - 500, windowWidth / 0.7, windowHeight / 0.7);
        image(cloud3, 2000, cloudMotion - 1500, windowWidth / 1.5, windowHeight / 1.5);
        image(cloud4, -400, cloudMotion - 2000, windowWidth / 1.8, windowHeight / 1.8);
        image(cloud5, 1000, cloudMotion - 2500, windowWidth / 0.7, windowHeight / 0.7);
        image(cloud8, 0, cloudMotion - 3000, windowWidth / 1.1, windowHeight / 1.1);
        image(cloud9, 800, cloudMotion - 4800, windowWidth / 1.6, windowHeight / 1.6);
        image(cloud12, -2500, cloudMotion - 8000, windowWidth / 0.5, windowHeight / 0.4);
        image(cloud1, 0, cloudMotion - 8500, windowWidth / 0.7, windowHeight / 0.7);

    } else {
        cloudMotion = -windowHeight;
    }
  // Calculate turn angle
  Angle = atan2(windowHeight / 2, windowWidth / 2) - atan2(RightHandy, RightHandx);s
  turnAngle = Angle-20;

  //flightMax = (windowWidth-RightHandx) / 100;
  //flightSpeed = (windowWidth/2 - RightHandx) * flightMax);
  flightSpeed = 30;
  // Draw bird
  if (RightHandx-LeftHandx <=100) {
  drawBird(RightHandx,RightHandy*2+200, turnAngle, flightSpeed);
} else return
  //drawBird(mouseX, mouseY,turnAngle, flightSpeed);



}


function drawBird(x, y, d, s) {
  var birdPosition = [x, y];
  wingWidthL = sin(flap) * 125 + 75;
  wingWidthR = sin(-flap) * 125 + 75;
  flap = flap + s;

  angleMode(DEGREES);

  translate(x, y);
  rotate(d);
  scale(BodySize);

  imageMode(CENTER);

  var leftWingP2X = 5;
  var leftWingP2Y = 65;
  var leftWingP1X = leftWingP2X - 250 + wingWidthL;
  var leftWingP1Y = leftWingP2Y - 250;

  var rightWingP1X = 5;
  var rightWingP1Y = -185;
  var rightWingP2X = rightWingP1X + 250 + wingWidthR - 145;
  var rightWingP2Y = rightWingP1Y + 250;

  image(body, 0, 0, 250, 250);
  image(head, 0, -140, 250, 250);


  imageMode(CORNERS);
  image(leftWing, leftWingP1X, leftWingP1Y, leftWingP2X, leftWingP2Y);
  image(rightWing, rightWingP1X, rightWingP1Y, rightWingP2X, rightWingP2Y);

}

function getClosestBodyIndex(bodies) {
  var closestZ = Number.MAX_VALUE;
  var closestBodyIndex = -1;

  for(var i = 0; i < bodies.length; i++) {
    if(bodies[i].tracked && bodies[i].joints[kinectron.SPINEMID].cameraZ < closestZ) {
      closestZ = bodies[i].joints[kinectron.SPINEMID].cameraZ;
      closestBodyIndex = i;
    }
  }

  return closestBodyIndex;
}
