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
  var Blackhole = DionicFactory.Blackhole;
  $scope.score = 0;
  $scope.initiated = false;


  var game = new Game();
  game.init();
  $scope.init = function(){
    $scope.initiated = true;
    animateStatus = true;
    game.start();
  };

  $scope.restartGame = function(){
    $scope.restartGameButton = false;
    restartGameButton = false;
    animateStatus = true;
    game.reset();
    game.start();
  };

  function Game() {
    this.init = function() {
      this.bgCanvas = document.getElementById('background');
      this.dinoCanvas = document.getElementById('dino');
      this.steakCanvas = document.getElementById('steak');
      this.blackholeCanvas = document.getElementById('blackhole');
      if (this.bgCanvas.getContext) {
        this.bgContext = this.bgCanvas.getContext('2d');
        this.dinoContext = this.dinoCanvas.getContext('2d');
        this.steakContext = this.steakCanvas.getContext('2d');
        this.blackholeContext = this.blackholeCanvas.getContext('2d');

        Background.prototype.context = this.bgContext;
        Background.prototype.canvasWidth = this.bgCanvas.width;
        Background.prototype.canvasHeight = this.bgCanvas.height;
        Dino.prototype.context = this.dinoContext;
        Dino.prototype.canvasWidth = this.dinoCanvas.width;
        Dino.prototype.canvasHeight = this.dinoCanvas.height;
        Steak.prototype.context = this.steakContext;
        Steak.prototype.canvasWidth = this.steakCanvas.width;
        Steak.prototype.canvasHeight = this.steakCanvas.height;
        Blackhole.prototype.context = this.blackholeContext;
        Blackhole.prototype.canvasWidth = this.blackholeCanvas.width;
        Blackhole.prototype.canvasHeight = this.blackholeCanvas.height;


        this.background = new Background();
        this.background.init(0,0);
        this.background.draw();

        this.dino = new Dino();
        var dinoX = 0;
        var dinoY = 400/2 - 75;
        this.dino.init(dinoX,dinoY,150,150);
        var b = this.dino;

        this.pool = new Pool(5);
        this.pool.init();

        var x = 600;
        var y = 400/2 - 32;

        for (var i = 0; i < 8; i++) {
          this.pool.get(x,y);
          x += 64 + 150;
          y = Math.floor(Math.random()* (400-64));
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

    this.reset = function() {
      this.dino.clear(0,400/2 - 75);
      this.steakContext.clearRect(0,0,600,400);
      this.blackholeContext.clearRect(0,0,600,400);
      this.pool.init();
      var x = 600;
      var y = 400/2 - 32;
      for (var i = 0; i < 8; i++) {
        this.pool.get(x,y);
        x += 64 + 150;
        y = Math.floor(Math.random()* (400-64));
      }
    }
  }


  function animate() {
    if(animateStatus){
      requestAnimFrame( animate );
      game.background.draw();
      game.dino.draw();
      game.pool.animate(game.dino);
      $timeout(function(){
        $scope.restartGameButton = restartGameButton;
        $scope.score = score;
        $scope.oldScore = oldScore;
      },0);
    }
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
    this.blackhole = new Image();

    this.background.src = "img/bg3.png";
    this.dino.src = "img/dino.png";
    this.steak.src = "img/steak.png";
    this.blackhole.src = "img/blackhole.png";
  };

  function Drawable() {
    this.init = function(x,y,width,height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    this.speed = 10;
    this.gravity = 12;
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
    var blackholeSize = 2;
    var pool = [];
    var poolBlackhole = [];

    this.init = function() {
      for (var i = 0; i < size; i++) {
        var steak = new Steak();
        steak.init(0,0, 64,64);
        pool[i] = steak;
      }
      for(var j = 0; j < blackholeSize ; j++){
        var blackhole = new Blackhole();
        blackhole.init(0,0, 150,150);
        poolBlackhole[j] = blackhole;
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
        } else {
          pool[i].restart();
        }
      }

      for (var j = 0; j < blackholeSize; j++) {
        if (poolBlackhole[j].alive) {
          if (poolBlackhole[j].draw(dino)) {
            poolBlackhole[j].clear();
            poolBlackhole.push((poolBlackhole.splice(j,1))[0]);
          }
        } else {
          poolBlackhole[j].restart();
        }
      }
    };
  }

  function Dino() {
    // var gravity = 5;
    this.draw = function() {
      this.context.clearRect(this.x,this.y,this.width,this.height);
      if((this.y <= 0)|| (this.y >= (400-this.height))){
      }else{
        this.y += this.gravity;
      }

      this.context.drawImage(imageRepo.dino, this.x, this.y);
    };

    this.invert = function() {
      this.gravity = this.gravity*-1;
      this.y += this.gravity;
    };

    this.clear = function(x,y) {
      this.context.clearRect(this.x,this.y,this.width,this.height);
      this.x = x;
      this.y = y;
      this.gravity = 12;
    }
  }
  Dino.prototype = new Drawable();

  function Steak() {
    this.alive = false;

    this.spawn = function (x,y) {
      this.x = x;
      this.y = y;
      this.alive = true;
    };

    this.draw = function(dino) {
      this.context.clearRect(this.x-1,this.y,this.width+1,this.height);
      this.x -= this.speed;

      if (this.x <= -64){
        return true;
      } else if( (this.y > dino.y) && (this.y < (dino.y + 150)) && ( (this.x < 150) && (this.x > 0) )){
        score++;
        return true;
      } else {
        this.context.drawImage(imageRepo.steak, this.x, this.y);
        return false;
      }
    };

    this.clear = function() {
      this.x = 600+65+200;
      this.y = Math.floor(Math.random() * (400 - this.width));
      this.speed = 0;
      this.alive = false;
    };

    this.restart = function() {
      this.speed = 10;
      this.alive = true;
    };
  }
  Steak.prototype = new Drawable();

  function Blackhole() {
    this.alive = false;

    this.spawn = function (x,y) {
      this.x = x;
      this.y = y;
      this.alive = true;
    };

    this.draw = function(dino) {
      this.context.clearRect(this.x-1,this.y,this.width+1,this.height);
      this.x -= this.speed;

      if (this.x <= -64){
        return true;
      } else if( (this.y > dino.y) && (this.y < (dino.y + 150)) && ( (this.x < 150) && (this.x > 0) )){
        console.log('blackhole hit');
        if(score > oldScore)
          oldScore = score;
        score = 0;
        animateStatus = false;
        restartGameButton = true;
        return true;
      } else {
        this.context.drawImage(imageRepo.blackhole, this.x, this.y);
        return false;
      }
    };

    this.clear = function() {
      this.x = 600+150+200;
      this.y = Math.floor(Math.random() * (400));
      this.speed = 0;
      this.alive = false;
    };

    this.restart = function() {
      this.speed = 10;
      this.alive = true;
    };
  }
  Blackhole.prototype = new Drawable();

  return {
    Drawable:Drawable,
    Background:Background,
    Dino:Dino,
    Steak:Steak,
    imageRepo:imageRepo,
    Pool:Pool,
    Blackhole:Blackhole
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
var oldScore = 0;
var restartGameButton = false;
var animateStatus = false;
