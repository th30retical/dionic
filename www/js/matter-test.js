// this allows us to initalize pictures once and not multiple times
var imageRepo = function() {
  this.background = new Image();

  this.background.src = "img/bg.png";
};

function Drawable() {
  this.init = function(x,y) {
    this.x = x;
    this.y = y;
  }

  this.speed = 0;
  this.gravity = 1;
  this.canvasWidth = 0;
  this.canvasHeight = 0;
  
  this.draw = function() {
  }
}
