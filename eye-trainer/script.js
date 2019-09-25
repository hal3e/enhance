// Global variables
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

circleCanvas = document.createElement('canvas');
circleCanvas.width  = 50;
circleCanvas.height = 50;

circleContext = circleCanvas.getContext('2d')
circleContext.beginPath();
circleContext.arc(25, 25, 25, 0, 2 * Math.PI, true);
circleContext.fillStyle = '#ff6666'
circleContext.fill();
circleContext.closePath();

// Different color when the circle reaches the endpoint
circleCanvas2 = document.createElement('canvas');
circleCanvas2.width  = 50;
circleCanvas2.height = 50;

circleContext2 = circleCanvas2.getContext('2d')
circleContext2.beginPath();
circleContext2.arc(25, 25, 25, 0, 2 * Math.PI, true);
circleContext2.fillStyle = '#3399ff'
circleContext2.fill();
circleContext2.closePath();

var width  = 700;
var height = 500;

canvas.width = width;
canvas.height = height;

var num_rows = 7;
var num_cols = 3;

var box_width  = 50;
var box_height = 50;

var box_x_offset = 50;
var box_y_offset = 50;

point = {
  xs : 0, ys : 0,
  xc : 0, yc : 0,
  xn : 0, xn : 0,
  px : 0, py : 0,
  r  : 25,
  c  : '#ff6666',
  nl : 1
}

t        = 0.0;
dt       = 0.1;
dt_max   = 0.15;
dt_step  = 0.005;
dt_start = dt;

var intervalDPoint = null;

game_state = 0;

// Initialize the text alignment
context.textBaseline="middle";
context.textAlign="center";
start_game();

// Mouse event listener
canvas.addEventListener('click', (mouse) => {
  if( game_state == 0 ) {
    game_state = 1;
    context.clearRect(0,0,width, height);
    window.requestAnimationFrame(point_animation)
   }
  else {
    window.cancelAnimationFrame(intervalDPoint);
    start_game();
    game_state = 0;
  }
}, false);

function draw_point(useCircle1) {
  context.clearRect(point.px - point.r - 20, point.py - point.r - 20, point.r * 2 + 50, point.r * 2 + 50);
  if( useCircle1 ) {
    context.drawImage(circleCanvas, point.xc - 25, point.yc - 25);
  }
  else {
    context.drawImage(circleCanvas2, point.xc - 25, point.yc - 25);
  }
}

function point_animation() {
  point.px = point.xc;
  point.py = point.yc;

  point.xc  = Math.floor(t * (point.xn - point.xc) + point.xc);
  point.yc  = Math.floor(t * (point.yn - point.yc) + point.yc);

  t += dt;
  if( t < 0.2 || t > 0.8 ){ draw_point(false) } else { draw_point(true) }

  // move to next point
  if( t >= 1.0 ) {
    t = 0.0
    point.nl ++;
    // if all points are done reset and speed up
    if( point.nl > (num_cols * num_rows) - 1 ) {
       point.nl = 0
       dt += dt_step;
       if ( dt > dt_max ) { dt = dt_start }
    }

    point.xs = point.xn
    point.ys = point.yn

    if( game_state == 1 ) {
      point.xn = Math.floor(Math.random() * box_width + box_x_offset + ((width - 2 * box_x_offset - box_width) / (num_cols -1 )) * (point.nl % num_cols))

      point.yn  = Math.floor(Math.random() * box_height + box_y_offset + ((height - 2 * box_y_offset - box_height) / (num_rows -1 )) * Math.floor(point.nl / num_cols))
    }
    else {
      point.xn = Math.floor(Math.random() * (width -  2 * box_x_offset) + box_x_offset)
      point.yn = Math.floor(Math.random() * (height - 2 * box_y_offset) + box_y_offset)
    }
  }
  intervalDPoint = window.requestAnimationFrame(point_animation)
}

function start_game() {
  point.xs =  Math.floor(Math.random() * box_width  + box_x_offset)
  point.ys =  Math.floor(Math.random() * box_height + box_y_offset)

  point.nl = 1
  t = 0.0

  point.xn =  Math.floor(Math.random() * box_width + box_x_offset + ((width - 2 * box_x_offset - box_width) / (num_cols -1 )) * (point.nl % num_cols))
  point.yn  =  Math.floor(Math.random() * box_height + box_y_offset + ((height - 2 * box_y_offset - box_height) / (num_rows -1 )) * Math.floor(point.nl / num_cols))

  point.xc = point.xs
  point.yc = point.ys
  point.px = point.xs
  point.py = point.ys

  context.clearRect(0,0,width,height);
  context.fillStyle = 'white';
  context.font = "60px Verdana";
  context.fillText("eye movement trainer",width/2,height/2 - 30);
  context.font = "20px Arial";
  context.fillText("click anywhere to start ",width/2,height/2 + 40);
}
