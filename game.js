

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
  rect(0, 740, 50, 10),
  rect(100, 120, 20, 20),
  rect(120, 140, 20, 20),
  rect(140, 160, 20, 20),
  rect(160, 180, 20, 20),
  rect(180, 200, 20, 20),
  rect(200, 220, 100, 20)
]

// Returns true if a and b overlap
function overlapTest(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y
}

// p represents the player obeject, and vx & vy are the x and y vertices
// checks to see if a collision will occur
function move(p, vx, vy) {
  
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

// Record which key codes are currently pressed
var keys = {}
document.onkeydown = function(e) { keys[e.which] = true }
document.onkeyup = function(e) { keys[e.which] = false }

// Player is a rectangle with extra properties
var player = rect(20, 20, 25, 25)
player.velocity = { x: 0, y: 0 }
player.onFloor = false

// Updates the state of the game for the next frame
function update() {
  // Update the velocity
  player.velocity.x = 3 * (!!keys[39] - !!keys[37]) // right - left
  player.velocity.y += 1 // Acceleration due to gravity

  // Move the player and detect collisions
  var expectedY = player.y + player.velocity.y
  move(player, player.velocity.x, player.velocity.y)
  player.onFloor = (expectedY > player.y)
  if (expectedY != player.y) player.velocity.y = 0

  // Only jump when we're on the floor
  if (player.onFloor && keys[38]) {
    player.velocity.y = -13
  }
}

// Renders a frame
function draw() {
  var c = document.getElementById('screen').getContext('2d')

  // Draw background
  c.fillStyle = '#EEE'
  c.fillRect(0, 0, c.canvas.width, c.canvas.height)

  // Draw player
  c.fillStyle = '#D00'
  c.fillRect(player.x, player.y, player.w, player.h)

  // Draw levels
  c.fillStyle = '#BBB'
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i]
    c.fillRect(r.x, r.y, r.w, r.h)
  }
}

// Set up the game loop (Update and Draw loop)
window.onload = function() {
  setInterval(function() {
    update()
    draw()
  }, 1000 / 120)
}