import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

var colors = ["#ffb3ba", "#d9b3ff", "#ffbaba", "#baffc9", "#b3bded"];
var colorCount = 0;
var buttons = [];
var gameSpeed;
var title1Flash, title2Flash, buttonFlash, scoreFlash, borderFlash, timeCount;
var speed;
var speedCounter;
var gameState = 0;
var titleCount1 = 0;
var titleCount2 = 1;
var titleCount3 = 2;
var titleCount4 = 3;
var startCount = 4;
var borderCount = 4;

highscore = new Ground.Collection('highscore');

Session.set("gameState", 0);

Meteor.startup(function () {
  if (Meteor.isCordova) {
    if (AdMob) {
      AdMob.createBanner( {
        adId: 'ca-app-pub-3080070244198226/2109901818',
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        isTesting: true,
        autoShow: true,
        success: function() {
          console.log("Received ad");
        },
        error: function() {
          console.log("No ad received");
        }
      });
    } else {
      console.log("No Admob");
    }
  } else {
    console.log("No Cordova ");
  }
  Meteor.subscribe('highscore');
});

Template.handler.helpers({
  'startState': function(){
    return Session.equals("gameState", 0)
  },
  'gameState': function(){
    return Session.equals("gameState", 1)
  }

});

Template.score.onCreated(function scoreOnCreated(){
  scoreFlash = setInterval(function(){ document.getElementById("score").style.color = colors[colorCount]; colorCount++; if(colorCount >=5){ colorCount=0;} }, 500);
});

Template.score.onDestroyed(function () {
  clearInterval(scoreFlash);
});

Template.titleScreen.onCreated(function scoreOnCreated(){
  title1Flash = setInterval(function(){ document.getElementById("title1").style.color = colors[titleCount1]; titleCount1++; if(titleCount1 >=5){ titleCount1=0;} }, 250);
  title2Flash = setInterval(function(){ document.getElementById("title2").style.color = colors[titleCount2]; titleCount2++; if(titleCount2 >=5){ titleCount2=0;} }, 250);
  title3Flash = setInterval(function(){ document.getElementById("title3").style.color = colors[titleCount3]; titleCount3++; if(titleCount3 >=5){ titleCount3=0;} }, 250);
  title4Flash = setInterval(function(){ document.getElementById("title4").style.color = colors[titleCount4]; titleCount4++; if(titleCount4 >=5){ titleCount4=0;} }, 250);
  buttonFlash = setInterval(function(){ document.getElementById("startButton").style.color = colors[startCount]; startCount++; if(startCount >=5){ startCount=0;} }, 250);
  borderFlash = setInterval(function(){ document.getElementById("startButton").style.borderColor = colors[borderCount]; borderCount++; if(borderCount >=5){ borderCount=0;} }, 250);
});

Template.titleScreen.events({
  'click #startButton': function(event){
    Session.set("gameState", 1);
  },
});

Template.titleScreen.helpers({
  'getScore': function() {
        return highscore.find();
      }

});

Template.titleScreen.onDestroyed(function () {
  clearInterval(title1Flash);
  clearInterval(title2Flash);
  clearInterval(title3Flash);
  clearInterval(title4Flash);
  clearInterval(buttonFlash);
  clearInterval(borderFlash);
});

Template.back.events({
  'click .backButton': function(event){
    clearInterval(gameSpeed);
    clearInterval(scoreFlash);
    Session.set("gameState", 0);
  },
});

Template.grid.events({
  'click #0': function(event){
      buttonCheck(0);
  },
  'click #1': function(event){
      buttonCheck(1);
  },
  'click #2': function(event){
      buttonCheck(2);
  },
  'click #3': function(event){
      buttonCheck(3);
  },
  'click #4': function(event){
      buttonCheck(4);
  },
  'click #5': function(event){
      buttonCheck(5);
  },
  'click #6': function(event){
      buttonCheck(6);
  },
  'click #7': function(event){
      buttonCheck(7);
  },
  'click #8': function(event){
      buttonCheck(8);
  }
});

Template.grid.onRendered(function () {
  startgame();
});

function startgame(){
  score = 0;
  speed = 700;
  speedCounter = 0;
  gameState = 0;
  initButtons();
  document.getElementById("score").innerHTML = score;
  for(var i=0; i<=8; i++){
    document.getElementById(i).style.backgroundColor = "#3e3e3e";
  }
  clearInterval(gameSpeed);
  gameSpeed = setInterval(function(){ gameLoop()}, speed);
}

function initButtons(){
  for(var i = 0; i <=8; i++){
    buttons[i] = i;
  }
}

function colorPicker(){
  var num = Math.floor((Math.random() * colors.length));
  return colors[num];
}

function buttonPick(){
  var rand = Math.floor(Math.random() * buttons.length);
  num = buttons.splice(rand, 1) -1 + 1;
  document.getElementById(num).style.backgroundColor = colorPicker();
}

function buttonOff(numButton){
  if(buttons.indexOf(numButton) == -1) {
    scorePlus();
    buttons.push(numButton);
  }
  else {
    // button already off
  }
  document.getElementById(numButton).style.backgroundColor =  "#3e3e3e";
}

function scorePlus(player){
    score++;
    document.getElementById("score").innerHTML = score;
}

function gameLoop(){
    buttonPick();
    if(buttons.length == 0) {
      clearInterval(gameSpeed);
      outcome();
    }
    speedCounter++;
    if(speedCounter == 5 && speed >= 500){
      speedCounter = 0;
      speed -= 25;
      clearInterval(gameSpeed);
      gameSpeed = setInterval(function(){ gameLoop()}, speed);
    }
  }

  function outcome(){
    var oldScore = highscore.findOne({name: "HIGHSCORE"}).score;
    var id = highscore.findOne({name: "HIGHSCORE"})._id;
    if( score > oldScore){
      highscore.remove(id);
      highscore.insert({name: "HIGHSCORE", score: score});
    }
    gameState=1;
  }

  function buttonCheck(buttonid){
    if(gameState == 0){
      buttonOff(buttonid);
    }
  }
