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

.controller('DionicController', function($scope, DionicFactory){
  var Drawable = DionicFactory.Drawable;
  var Background = DionicFactory.Background;
  var Dino = DionicFactory.Dino;
  var imageRepo = DionicFactory.imageRepo;
  // var Game = DionicFactory.Game;
  // var animate = DionicFactory.animate;

  var game = new Game();
  // console.log(game);
  if (game.init()){
    game.start();
  }

  function Game() {
    this.init = function() {
      this.bgCanvas = document.getElementById('background');
      this.dinoCanvas = document.getElementById('dino');
      if (this.bgCanvas.getContext) {
        this.bgContext = this.bgCanvas.getContext('2d');
        this.dinoContext = this.dinoCanvas.getContext('2d');

        Background.prototype.context = this.bgContext;
        Background.prototype.canvasWidth = this.bgCanvas.width;
        Background.prototype.canvasHeight = this.bgCanvas.height;
        Dino.prototype.context = this.dinoContext;
        Dino.prototype.canvasWidth = this.dinoCanvas.width;
        Dino.prototype.canvasHeight = this.dinoCanvas.height;

        this.background = new Background();
        this.background.init(0,0);

        this.dino = new Dino();
        var dinoX = this.dinoCanvas.width/4 - imageRepo.dino.width;
        var dinoY = this.dinoCanvas.height/2 - imageRepo.dino.height;
        // console.log(imageRepo.dino.width);
        this.dino.init(dinoX,dinoY,600,600);
        // console.log(this.background);
        // game = this;
        return true;
      } else {
        return false;
      }
    };

    this.start = function() {
      // console.log(this);
      // this.dino.draw();
      animate();
    };
  }

  function animate() {
    // console.log("run");
    requestAnimFrame( animate );
    game.background.draw();
    game.dino.draw();
  }

})

.factory('DionicFactory', function(){
  // var game;
  // this allows us to initalize pictures once and not multiple times
  var imageRepo = new function() {
    this.empty = null;
    this.background = new Image();
    this.dino = new Image();

    this.background.src = "img/bg2.png";
    this.dino.src = "img/dino.png";
    console.log("done");
  };

  function Drawable() {
    this.init = function(x,y,width,height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    this.speed = 0;
    this.gravity = 1;
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

  function Dino() {
    // var counter = 0;
    this.draw = function() {
      this.context.drawImage(imageRepo.dino, this.x, this.y);
    };
  }
  Dino.prototype = new Drawable();

  return {
    Drawable:Drawable,
    Background:Background,
    Dino:Dino,
    imageRepo:imageRepo
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
