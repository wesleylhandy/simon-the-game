$(document).ready(function(){

	/********** DYNAMIC STYLING **********/
	$("main").css("width", window.innerHeight).css("height", window.innerHeight);

	/********** GAME LOGIC **********/

	//global variables
	var delayMoves, delayTimer, powerOn = false, 
		strictMode = false, gameOn = false, 
		userTurn = false, movesToMatch = [], userMoves = [];

	//OBJECT CONSTRUCTORS

	//CREATE QUEUE CONSTRUCTOR
	var Queue = function(arr) {
		this.queue = arr.slice(0);
		this.length = arr.length;
	}

	Queue.prototype.dequeue = function() {
		if (this.length > 0) {
			this.length--;
			return this.queue.shift();
		}
	}

	Queue.prototype.getLength = function() {
		return this.length;
	}

	//CREATE AI CONSTRUCTOR
	var AI = function() {
		this.movesArray = [];
		this.moveInterval = 1500;
		this.turn = 1;
	}

	AI.prototype.getNewAiMove = function() {

		var num = Math.floor(Math.random()*4 + 1);

		this.movesArray.push(num);
		
		this.turn++;

		if(this.turn >=5 ) {
			this.moveInterval = 1000;
		} else if (this.turn >= 9) {
			this.moveInterval = 700;
		} else if (this.turn >= 13) {
			this.moveInterval = 400;
		}

		this.displayMoves();
	}

	AI.prototype.getTurns = function() {
		return this.turn;
	}

	AI.prototype.getMoves = function() {
		return this.movesArray;
	}

	AI.prototype.getInterval = function() {
		return this.moveInterval;
	}

	AI.prototype.displayMoves = function(){

		this.queue = new Queue(this.movesArray);

		var self = this;

		function next() {
			self.nextMove();
		}

		this.delay = setInterval(next, this.moveInterval);
	}
	
	AI.prototype.nextMove = function(){

		if (this.queue.getLength() == 0) {
			clearInterval(this.delay);
			return;
		}

		var move = this.queue.dequeue();

		function displayMove() {
			sounds[move].sound.play();
			$("."+colors[move]).toggleClass("light");
		}

		function endDisplayMove() {
			$("."+colors[move]).toggleClass("light");
		}

		displayMove();

		this.timeout = setTimeout(endDisplayMove, this.moveInterval-200);
	}

	AI.prototype.reset = function() {
		this.movesArray = [];
		this.moveInterval = 1500;
		this.turn = 1;
	}

	AI.prototype.clear = function() {
		clearInterval(this.delay);
	}

	//MAIN GAME FUNCTIONALITY

	//initialize ai
	var ai = new AI();

		//create a function to alternate turns
	function alternate() {

		if (!userTurn) {

			if (ai.getTurns() == 20) {
				//game has been won!!!
				displayEndingMove("$$");
				playSound("win");

				delayMoves = setTimeout(gameOver, 500);
			} else {
				var turnDisplay = "0" + ai.getTurns();
				$("#turn-text").text(turnDisplay.slice(-2));

				ai.getNewAiMove();

				movesToMatch = ai.getMoves();

				var interval = movesToMatch.length * ai.getInterval() + ai.getInterval();

				//call userMove
				delayMoves = setTimeout(userMove, interval); 
			}
		}
	
	}

	function userMove() {
		//initialize userMove
		userMoves = [];
		userTurn = true;

		delayTimer = setTimeout(timeExpired, 4000);
	}

	function timeExpired() {
		//alert user
		displayEndingMove("!!");
		playSound("lose");
		
		if (!strictMode) {
			//call function to replay round
			delayMoves = setTimeout(replayNonStrict, 500);
			
		} else {
			//call gameover function
			delayMoves = setTimeout(gameOver, 500);
		
		}
	}
		
	//checks that a user move is the right move in the right order, returns boolean
	function checkMoves() {
		var goodMove = true;
		for (let i = 0; i < userMoves.length; i++) {
			if (userMoves[i] != movesToMatch[i]) {
				goodMove = false;
			}
		}
		return goodMove;
	}

	//shows to the user the ai moves again for replay
	function replayNonStrict() {

		userTurn = false; //flag to prevent user playing moves
		//reset display to current round
		var turnDisplay = "0" + ai.getTurns();
		$("#turn-text").text(turnDisplay.slice(-2));
		//call function to display ai moves
		ai.displayMoves();
		var arr = ai.getMoves();
		var interval = arr.length * ai.getInterval() + ai.getInterval();
		console.log(interval);
		// call userMove again
		userMoves = [];
		delayMoves = setTimeout(userMove, interval);
	}

	//returns game display to original setting
	function gameOver() {
		ai.reset();
		$("#turn-text").text("--");
	}

	//animation when a user goes past time or misses the mark
	function displayEndingMove(symbol) {
		$("#turn-text").text(symbol).animate({
	    	opacity: 0
	  	}, 125, function() {
		    $("#turn-text").animate({
		    	opacity: 1
		    }, 125, function () {
		    	$("#turn-text").animate({
		    		opacity: 0
		    	}, 125, function() {
		    		$("#turn-text").animate({
		    			opacity: 1
		    		}, 125);
		    	});
		    });
		});
	}

	//object holding keys to colors
	const colors = {
		"1": "green",
		"2": "red",
		"3": "yellow",
		"4": "blue"
	}

	//object holding keys to sounds
	const sounds = {
		"1": {
			sound: new Howl({ 
				src: ['assets/sounds/simonSound1.mp3'],
				volume: 1,
				rate: 0.5
			})
		},
		"2": {
			sound: new Howl({
				src: ['assets/sounds/simonSound2.mp3'],
				volume: 1,
				rate: 0.5
			})
		},
		"3": {
			sound: new Howl({
				src: ['assets/sounds/simonSound3.mp3'],
				volume: 1,
				rate: 0.5
			})
		},
		"4": {
			sound: new Howl({
				src: ['assets/sounds/simonSound4.mp3'],
				volume: 1,
				rate: 0.5
			})
		},
		'lose': {
			sound: new Howl({
				src: ['assets/sounds/sound8.mp3'],
				volume: 0.5,
				rate: 0.5
			})
		},
		'win': {
			sound: new Howl({
				src: ['assets/sounds/sound106.wav'],
				volume: 1,
				rate: 1
			})
		}
	}

	function playSound(index) {
		sounds[index].sound.play();
	}

	function gameReset() {
		//clear any intervals or timeouts
		ai.clear();
		clearTimeout(delayMoves);
		clearTimeout(delayTimer);
		//reset ai to initial conditions
		ai.reset();
		//reset turn screen
		$("#turn-text").text('--');
	}

	/*********** EVENT HANDLERS **********/

	$("#power-toggle-button").click(function(){
		powerOn = !powerOn;
		gameReset();
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
			gameReset();
			gameOn = true;
			alternate();
		}
	});

	$("#start-game-button").mouseup(function(){
		$(this).css("box-shadow", "inset 1px 1px 2px white")
	});

	//gamepad event listeners
	$(".game-pad").mousedown(function(){
		if(gameOn && userTurn && userMoves.length < movesToMatch.length) {
			$(this).toggleClass("light");
			var index = $(this).attr("data-colorIndex");
			playSound(index);
		}
	});

	$(".game-pad").mouseup(function(){
		if(gameOn && userTurn) {
			$(this).toggleClass("light");
			var index = $(this).attr("data-colorIndex");
			userMoves.push(index);
			if (checkMoves()) {
				
				//if all moves taken, call function to signal ai turn
				if (userMoves.length == movesToMatch.length) {
					clearTimeout(delayTimer); //clear previous timer
					userTurn = false;
					//call function for new ai move
					alternate();

				} else { //correct move, but still have moves to make
					clearTimeout(delayTimer); //clear previous timer
					delayTimer = setTimeout(timeExpired, 4000); //set new timer
				}
			} else {
				//missed one
				userTurn = false;
				clearTimeout(delayTimer);
				displayEndingMove("!!");
				playSound("lose");
				timeExpired();
			}
		}
	});

});