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
  var Game = DionicFactory.Game;
  var animate = DionicFactory.animate;
  Background.prototype = new Drawable();

  var game = new Game();
  // console.log(game);
  if (game.init()){
    game.start();
  }


})

.factory('DionicFactory', function(){
  var GAME;
  // this allows us to initalize pictures once and not multiple times
  var imageRepo = new function() {
    this.empty = null;
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

  function Background() {
    this.speed = 1;

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
  function Game() {
    this.init = function() {
      this.bgCanvas = document.getElementById('background');
      if (this.bgCanvas.getContext) {
        this.bgContext = this.bgCanvas.getContext('2d');
        console.log(this.bgContext);
        Background.prototype.context = this.bgContext;
        Background.prototype.canvasWidth = this.bgCanvas.width;
        Background.prototype.canvasHeight = this.bgCanvas.height;

        this.background = new Background();
        // console.log(this.background);
        this.background.init(0,0);
        GAME = this;
        return true;
      } else {
        return false;
      }
    };

    this.start = function() {
      // console.log(this);
      animate();
    };
  }

  function animate() {
    requestAnimFrame( animate );
    // console.log(game);
    GAME.background.draw();
  }



  return {
    Drawable:Drawable,
    Game:Game,
    Background:Background,
    animate:animate
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
