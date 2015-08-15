// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var game = new Game();
angular.module('starter', ['ionic', 'controllers', 'services'])

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

    // Matter.js module aliases
    // var Engine = Matter.Engine,
    // World = Matter.World,
    // Bodies = Matter.Bodies;
    //
    // // create a Matter.js engine
    // var engine = Engine.create(document.body);
    //
    // // create two boxes and a ground
    // var boxA = Bodies.rectangle(400, 200, 80, 80);
    // var boxB = Bodies.rectangle(450, 50, 80, 80);
    // var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    //
    // // add all of the bodies to the world
    // World.add(engine.world, [boxA, boxB, ground]);
    //
    // // run the engine
    // Engine.run(engine);
    //
    // console.log("ran");


    if (game.init())
      game.start();



  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('Main', {
    url: '/',
    templateUrl: 'templates/main.html',
    controller: 'AppCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

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
      this.background.init(0,0);
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
  requestAnimFrame( animate );
  game.background.draw();
}

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
