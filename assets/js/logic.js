$(document).ready(function(){

var powerOn = false;
var strictMode = false;
var gameOn = false;

/*********** EVENT HANDLERS **********/

	$("#power-toggle-button").click(function(){
		powerOn = !powerOn;
		if (!powerOn) {
			gameOn = false;
			$("#strict-toggle-display").removeClass("on");
		}
		$("#power-button").toggleClass("on");
		$("#turn-display").toggleClass("on");
	});

	$("#strict-button").mousedown(function(){
		$(this).css("box-shadow", "inset -1px 1px 2px black");
		if(powerOn) {
			strictMode = !strictMode;
			$("#strict-toggle-display").toggleClass("on");
		}
	});

	$("#strict-button").mouseup(function(){
		$(this).css("box-shadow", "inset 1px 1px 2px white")
	});

	$("#start-game-button").mousedown(function(){
		$(this).css("box-shadow", "inset -1px 1px 2px black");
		if(powerOn) {
			gameOn = true;
			start();
		}
	});

	$("#start-game-button").mouseup(function(){
		$(this).css("box-shadow", "inset 1px 1px 2px white")
	});

	$(".game-pad").mousedown(function(){
		if(gameOn) {
			$(this).toggleClass("light");
			var color = $(this).data("color");
			playSound(color);
		}
	});

	$(".game-pad").mouseup(function(){
		if(gameOn) {
			$(this).toggleClass("light");
			var color = $(this).data("color");
			stopSound(color);
		}
	});

});

/********** GAME LOGIC **********/

function start() {

}

function playSound(color) {

}

function stopSound(color) {

}


//game functionality

//get a random number between 1 & 4
//add number to an array
//play sounds corresponding to number, in order, at a given interval
//listen for user presses
//record presses to an array
//after every press, verify that the correct button was pressed
//if in regular mode, if incorrect button pressed, 
	//replay sounds from beginning
	//and allow user to try again

//if in strict mode, if incorrect button pressed
	//play error sound
	//reset numbers array
	//new game at turn 1

//when number array >= 5, reduce interval for playing sounds
//when number array >=9, reduce interval
//when number array >=13, reduce interval

//user whens at turns = 20
//reset turns and interval