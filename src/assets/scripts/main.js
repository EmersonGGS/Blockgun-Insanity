//Author: Emerson Stewart
//Date: November 10th, 2014

///////////////////
//Init Variables//
/////////////////
var notConnected = true;
var playersArray = [];
var bullets = [];
var userID;

// Create New Socket Connection using Socket.io
var socket = io();

// Create a rectangle with an (x, y) coordinate, a width, and a height
function rect(x, y, w, h) {
  return { x: x, y: y, w: w, h: h }
}

// Represent the level as a list of rectangles
var rects = [
	//Map Borders
  rect(0, 0, 1100, 3),
  rect(0, 0, 3, 800),
  rect(0, 789, 1100, 15),
  rect(1097, 0, 3, 800),

  	//Map platforms

    //Death Chamber
  rect(0, 450, 50, 10),
  rect(100, 450, 120, 10),
  rect(220, 450, 10, 210),
  rect(40, 540, 180, 6),
  rect(0, 600, 180, 6),
  rect(190, 660, 20, 20),
  rect(165, 680, 20, 20),
  rect(140, 700, 20, 20),
  rect(115, 720, 20, 20),
  rect(70, 760, 20, 20),
  rect(45, 740, 20, 20 ),
  rect(22, 720, 20, 20),
  rect(0, 700, 20, 20),


    ////////////////////
    //Hallway of Doom//
    //////////////////

  rect(220, 650, 800, 10),
  rect(260, 650, 30, 70),
  rect(360, 720, 30, 70),
  rect(460, 650, 30, 70),
  rect(560, 720, 30, 70),
  rect(660, 650, 30, 70),
  rect(760, 720, 30, 70),
  rect(860, 650, 30, 70),
  rect(960, 720, 30, 70),
  rect(1050, 720, 80, 10),


    ///////////////////////
    //Stairway to Heaven//
    /////////////////////

  rect(1050, 600, 80, 6),
  rect(920, 550, 80, 6),
  rect(1050, 500, 80, 6),
  rect(920, 450, 80, 6),
  rect(1050, 400, 80, 6),
  rect(920, 350, 80, 6),
  rect(1050, 300, 80, 6),
  rect(920, 250, 80, 6),
  rect(1050, 200, 80, 6),
  rect(990, 150, 50, 6),


    //////////////////
    //The Drop Zone//
    ////////////////

  rect(60, 130, 200, 6),
  rect(310, 100, 200, 6),
  rect(550, 130, 200, 6),
  rect(800, 100, 200, 6),


    ////////////////////
    //Pin-ball Poluza//
    //////////////////

    rect(300, 405, 30, 30),
    rect(400, 430, 30, 30),
    rect(500, 450, 30, 30),
    rect(600, 460, 30, 30),
    rect(700, 480, 30, 30),
    rect(800, 500, 30, 30),

    rect(300, 580, 30, 30),
    rect(400, 600, 30, 30),
    rect(500, 530, 30, 30),
    rect(600, 505, 30, 30),
    rect(700, 560, 30, 30),
    rect(800, 550, 30, 30),

    rect(300, 400, 30, 30),
    rect(400, 350, 30, 30),
    rect(500, 360, 30, 30),
    rect(600, 380, 30, 30),
    rect(700, 305, 30, 30),
    rect(800, 330, 30, 30),

    rect(300, 300, 30, 30),
    rect(400, 230, 30, 30),
    rect(500, 250, 30, 30),
    rect(600, 205, 30, 30),
    rect(700, 280, 30, 30),
    rect(800, 260, 30, 30),
]

// Returns true if a and b overlap
function overlapTest (a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y
}

function fire (e) {
  //init variables for mouse coords
  var mouseX, mouseY;

  //set coords in relation to canvas
  if(e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
  }
  else if(e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
  }

  //Test console
  // console.log("Fired");
  // console.log("mouse x: " + mouseX + " mouse y: " + mouseY + "player x: " + player.x);

  //create bullet
  var bullet = rect(player.x , player.y , 5, 5);
  bullet.x = bullet.x + 8;
  bullet.y = bullet.y + 8;
  

  //Set bullets direction and velocity
  if (mouseX >= bullet.x) { // fire bullet to left of player
    bullet.velocity = { x: 30, y: 0 };
    move(bullet, bullet.velocity.x, bullet.velocity.y);
  } 
  else if (mouseX < bullet.x) { //fire bullet to left of player
    bullet.velocity = { x: -30, y: 0 };
    move(bullet, bullet.velocity.x, bullet.velocity.y);
  }
  else { 
    //error handle to prevent crash
  }

  bullets.push(bullet);
}

// p represents the player obeject (or bullet), and vx & vy are the x and y vertices
// checks to see if a collision will occur
function move (p, vx, vy) {
  
  // Move rectangle along x axis
  for (var i = 0; i < rects.length; i++) {
    var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
    if (overlapTest(c, rects[i])) {
      if (vx < 0) vx = rects[i].x + rects[i].w - p.x
      else if (vx > 0) vx = rects[i].x - p.x - p.w
    }
  }
  p.x += vx

  // Move rectangle along y axis
  for (var i = 0; i < rects.length; i++) {
    var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
    if (overlapTest(c, rects[i])) {
      if (vy < 0) vy = rects[i].y + rects[i].h - p.y
      else if (vy > 0) vy = rects[i].y - p.y - p.h
    }
  }
  p.y += vy
}

socket.on('connected',function(id){
  if(notConnected){
    userID = id;
    notConnected = false;      
  }
  console.log(userID);
});

// Record which key codes are currently pressed
var keys = {}
document.onkeydown = function(e) { keys[e.which] = true }
document.onkeyup = function(e) { keys[e.which] = false }

// Player is a rectangle with extra properties
var player = rect(20, 20, 25, 25);
player.velocity = { x: 0, y: 0 };
player.onFloor = false;

// Updates the state of the game for the next frame
function update() {
  // Update the velocity
  player.velocity.x = 8 * (!!keys[39] - !!keys[37]) // right - left
  player.velocity.y += 1.3 // Acceleration due to gravity

  // Move the player and detect collisions
  var expectedY = player.y + player.velocity.y
  move(player, player.velocity.x, player.velocity.y)
  player.onFloor = (expectedY > player.y)
  if (expectedY != player.y) player.velocity.y = 0

  // Only jump when we're on the floor
  if (player.onFloor && keys[38]) {
    player.velocity.y = -15
  }

  //Update bullets movement
  for (var i = 0; i < bullets.length; i++) {
    move(bullets[i], bullets[i].velocity.x, bullets[i].velocity.y);
    if (bullets[i].x > 1099 || bullets[i].x < 1) {
      console.log("remove bullet");
      var bulletIndex = bullets.indexOf(i);
      bullets.shift();
    };
  };
}

// Renders a frame
function draw(array, clientBullets) {
  var c = document.getElementById('screen').getContext('2d')

  socket.emit('updatePlayer', player, userID, clientBullets);

  // Draw background
  c.fillStyle = '#ecf0f1'
  c.fillRect(0, 0, c.canvas.width, c.canvas.height)

  // Draw current player
  c.fillStyle = '#e74c3c';
  c.fillRect(player.x, player.y, player.w, player.h);

  // Draw each player connected the server
  for(var i = 0; i < array.length; i++) {
    if ( i == userID || i != 0 ) {
      // Do not create player object for clients canvas
      //- created above
    } 
    else {
      // Draw all other players
      c.fillStyle = '#e74c3c';
      c.fillRect(array[i].x, array[i].y, 25, 25);
    }
  }

  //Draw Bullets
  for(var i = 0; i < clientBullets.length; i++) {
    c.fillStyle = '#34495e';
    c.fillRect(clientBullets[i].x, clientBullets[i].y, 9, 9);
  }

  // Draw levels
  c.fillStyle = '#7f8c8d'
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i]
    c.fillRect(r.x, r.y, r.w, r.h)
  }
}



socket.on('renderPlayers', function(array, allBullets){
  playersArray = array;
  bullets = allBullets;
});

// Set up the game loop (Update and Draw loop)
window.onload = function() {
  setInterval(function() {
    update();
    draw(playersArray, bullets);
  }, 1000 / 30)
}