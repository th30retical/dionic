// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('dionic', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function() {
})

.controller('DionicController', function($scope, DionicFactory, $timeout){
  var Drawable = DionicFactory.Drawable;
  var Background = DionicFactory.Background;
  var Dino = DionicFactory.Dino;
  var Steak = DionicFactory.Steak;
  var imageRepo = DionicFactory.imageRepo;
  var Pool = DionicFactory.Pool;
  // var Game = DionicFactory.Game;
  // var animate = DionicFactory.animate;
  $scope.score = 0;
  var game = new Game();
  // console.log(game);
  if (game.init()){
    game.start();
  }


  function Game() {
    this.init = function() {
      this.bgCanvas = document.getElementById('background');
      this.dinoCanvas = document.getElementById('dino');
      this.steakCanvas = document.getElementById('steak');
      if (this.bgCanvas.getContext) {
        this.bgContext = this.bgCanvas.getContext('2d');
        this.dinoContext = this.dinoCanvas.getContext('2d');
        this.steakContext = this.steakCanvas.getContext('2d');

        Background.prototype.context = this.bgContext;
        Background.prototype.canvasWidth = this.bgCanvas.width;
        Background.prototype.canvasHeight = this.bgCanvas.height;
        Dino.prototype.context = this.dinoContext;
        Dino.prototype.canvasWidth = this.dinoCanvas.width;
        Dino.prototype.canvasHeight = this.dinoCanvas.height;
        Steak.prototype.context = this.steakContext;
        Steak.prototype.canvasWidth = this.steakCanvas.width;
        Steak.prototype.canvasHeight = this.steakCanvas.height;


        this.background = new Background();
        this.background.init(0,0);

        this.dino = new Dino();
        var dinoX = 0;
        // console.log(this.dino.height);
        var dinoY = window.innerHeight/2 - 75;
        this.dino.init(dinoX,dinoY,150,150);
        var b = this.dino;

        this.pool = new Pool(8);
        this.pool.init();

        var x = window.innerWidth;
        var y = window.innerHeight/2 - 32;

        for (var i = 0; i < 8; i++) {
          this.pool.get(x,y);
          x += 64 + 150;
          y = Math.floor(Math.random()* (window.innerHeight-64));
        }

        $scope.onTap = function() {
          b.invert();
        };

        return true;
      } else {
        return false;
      }
    };

    this.start = function() {
      animate();
    };
  }


  function animate() {
    $timeout(function(){
      $scope.score = score;
    },0);
    requestAnimFrame( animate );
    game.background.draw();
    game.dino.draw();
    game.pool.animate(game.dino);
  }

})

.factory('DionicFactory', function(){
  // var game;
  // this allows us to initalize pictures once and not multiple times
  var imageRepo = new function() {
    this.empty = null;
    this.background = new Image();
    this.dino = new Image();
    this.steak = new Image();

    this.background.src = "img/bg3.png";
    this.dino.src = "img/dino.png";
    this.steak.src = "img/steak.png";
  };

  function Drawable() {
    this.init = function(x,y,width,height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    this.speed = 0;
    this.gravity = 5;
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    this.draw = function() {
    }
  }

  function Background() {
    this.speed = 5;

    this.draw = function() {
      this.x -= this.speed;

      this.context.drawImage(imageRepo.background, this.x, this.y);
      this.context.drawImage(imageRepo.background, this.x+this.canvasWidth, this.y);

      if (this.x <= -this.canvasWidth) {
        this.x = 0;
      }
    };
  }
  Background.prototype = new Drawable();

  function Pool(maxSize) {
    var size = maxSize;
    var pool = [];

    this.init = function() {
      for (var i = 0; i < size; i++) {
        var steak = new Steak();
        steak.init(0,0, 64,64);
        pool[i] = steak;
      }
    };

    this.get = function(x,y) {
      if (!pool[size - 1].alive) {
        pool[size -1].spawn(x,y);
        pool.unshift(pool.pop());
      }
    };

    this.animate = function(dino) {
      for (var i = 0; i < size; i++) {
        if (pool[i].alive) {
          if (pool[i].draw(dino)) {
            pool[i].clear();
            pool.push((pool.splice(i,1))[0]);
          }
          // pool[i].collision(dino);
        } else {
          pool[i].restart();
        }
      }
    };
  }

  function Dino() {
    // var counter = 0;
    var change = false;
    this.draw = function() {
      this.context.clearRect(this.x,this.y,this.width,this.height);
      // this.y += this.gravity;
      if ((this.y <= (window.innerHeight - this.height) && this.y >= 0)) {
        this.y += this.gravity;
      } else {
        if (change){
          this.y += this.gravity;
          change = false;
        }
      }

      this.context.drawImage(imageRepo.dino, this.x, this.y);
    };

    this.invert = function() {
      this.gravity = this.gravity*-1;
      change = true;
      // return this.gravity;
    };
  }
  Dino.prototype = new Drawable();

  function Steak() {
    this.alive = false;
    this.speed = 5;

    this.spawn = function (x,y) {
      this.x = x;
      this.y = y;
      this.alive = true;
    };
    // var counter = 0;
    this.draw = function(dino) {
      this.context.clearRect(this.x-1,this.y,this.width+1,this.height);
      this.x -= this.speed;

      if (this.x <= -64){
        return true;
      } else if( (this.y > dino.y) && (this.y < (dino.y + 150)) && ( (this.x < 150) && (this.x > 0) )){
        score++;
        console.log('collision');
        return true;
      } else {
        this.context.drawImage(imageRepo.steak, this.x, this.y);
        return false;
      }
    };

    this.clear = function() {
      this.x = window.innerWidth+65+200;
      this.y = Math.floor(Math.random() * (window.innerHeight - this.width));
      this.speed = 0;
      this.alive = false;
    };

    this.restart = function() {
      this.speed = 5;
      this.alive = true;
    };
  }
  Steak.prototype = new Drawable();

  return {
    Drawable:Drawable,
    Background:Background,
    Dino:Dino,
    Steak:Steak,
    imageRepo:imageRepo,
    Pool:Pool
  }
});

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

var score = 0;
