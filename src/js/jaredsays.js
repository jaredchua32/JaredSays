var $buttonsContainer,
	$scoreContainer,
	$highScoreContainer,
	$startButton,
	$infoContainer,
	$infoContainerText,
	$buttons;

var sequence = [],
	userSequence = [],
	offColors = ["#5E0000", "#002B63", "#004D09", "#414500"],
	onColors = ["#FF4F4F", "#177CFF", "#12FF12", "#FFFF12"];

var score,
	highScore,
	sequenceLength,
	level,
	userClicks,
	displayIteration;

var displayHandler,
	windowResizeHandler;

function visible($inputElement) {
	$inputElement.css('visibility', 'visible');
}

function invisible($inputElement) {
	$inputElement.css('visibility', 'hidden');
}

function showButtons() {
	resizeButtons();
	$buttons.show();
}

function resizeButtons() {
	var currentWidth = ($buttonsContainer.width() * .5 + "px");
	
	$buttons.css("height", currentWidth);
	$buttonsContainer.css("border-radius", currentWidth);
	$buttons.eq(0).css("border-top-left-radius", currentWidth);
	$buttons.eq(1).css("border-top-right-radius", currentWidth);
	$buttons.eq(2).css("border-bottom-left-radius", currentWidth);
	$buttons.eq(3).css("border-bottom-right-radius", currentWidth);
}

function hideInstructions() {
	$("div#instructionsBox > div > p").hide();
}

function hideScore() {
	$("#statusBar").hide();
}

function showScore() {
	$("#statusBar").show();
}

function updateScore() {
	if(score > highScore) {
		highScore = score;
		updateHighScore();
	}
	$scoreContainer.text("Score: " + score);
}

function updateHighScore() {
	$highScoreContainer.text("High score: " + highScore);
}

function flashBoard() {
	$buttonsContainer.css("border", "3px solid rgba(255,255,255,0.7)");
	setTimeout(function() {
		$buttonsContainer.css("border", "3px solid rgba(255,255,255,0.0)");
	}, 800);
}

function activateLight(buttonIndex) {
	var $currentButton = $buttons.eq(buttonIndex);

	$currentButton.css("background-color", onColors[buttonIndex]);
	setTimeout(function() {
		$currentButton.css("background-color", offColors[buttonIndex]);
	}, 800);
}

function gameOver() {
	$infoContainer.text("Game over");
	$startButton.children('p').text("Play again?");
	visible($infoContainer);
	setTimeout(function() {
		visible($startButton);
	}, 750);
	$startButton.on("click", restartGame);
}

function enableUserInput() {
	$buttons.on("click", clickButton);
}

function disableUserInput() {
	$buttons.off("click", clickButton);
	$buttons.removeClass("pointer");

}

function userTurn() {
	userClicks = 0;

	setTimeout(function() {
		$infoContainer.text("Your turn");
		visible($infoContainer);
		setTimeout(function() {
			$buttons.addClass("pointer");
			invisible($infoContainer);
		}, 1000);
	}, 1000);
	enableUserInput();
}

function clickButton() {
	var correctButton = sequence[userClicks],
		buttonIndex = parseInt($(this).data("index"));
	userClicks++;
	activateLight(buttonIndex);
	invisible($infoContainer);
	//Case 1: User clicked the wrong button.
	if(buttonIndex !== correctButton) {
		disableUserInput();
		gameOver();
	} 
	//Case 2: User clicked the correct button and completes the level.
	else if(buttonIndex == correctButton &&
		userClicks == level) {
		disableUserInput();
		setTimeout(nextLevel, 1000);
		score++
		flashBoard();
		updateScore();
	}
	//Case 3: User clicked the correct button but the level is not complete.
	//Do nothing
} 

function displaySequence(currentSequence) {
	displayIteration = 0;
	displayHandler = setInterval( function() {
		activateLight(currentSequence[displayIteration]);
		displayIteration++;
		if(displayIteration == level) {
			userTurn();
			clearInterval(displayHandler);
		}
	}, 1000);
}

function nextLevel() {
	level++;
	sequence.push(Math.floor(Math.random() * (4)));
	displaySequence(sequence);
}

function restartGame() {
	$startButton.off("click", startGame)
	invisible($startButton);
	invisible($infoContainer);
	score = 0;
	level = 0;
	sequence = [];
	updateScore();
	nextLevel();
}

function startGame() {
	$startButton.off("click", startGame);
	invisible($startButton);
	hideInstructions();
	updateScore();
	showButtons();
	showScore();
	nextLevel();
}

function init() {
	$buttonsContainer = $("#buttonsContainer");
	$buttons = $(".button");
	$startButton = $("#startBtn");
	$scoreContainer = $("#statusBar div:first-child p");
	$highScoreContainer = $("#statusBar div:last-child p");
	$infoContainer = $("#infoBox p");
	
	highScore = 0;
	score = 0;
	level = 0;
	sequence = [];

	$buttons.hide();
	$("#statusBar").hide();
	disableUserInput();

	$startButton.on("click", startGame);
	$(window).on("resize", resizeButtons);
}

window.onload = init;