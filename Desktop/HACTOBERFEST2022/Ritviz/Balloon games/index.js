let colors = ['yellow', 'red', 'blue', 'violet', 'green'];  // for selecting  different color
let windowWidth = window.innerWidth;                       // inner width of screen
let windowHeight = window.innerHeight;           //inner height of screen
let body = document.body;
let scores = document.querySelectorAll('.score');
let num = 0;       // number of balloons popped 
let total = 100;  // Number of balloons that are to be popped to win
let currentBallon = 0;
let gameOver = false;
let totalShadow = document.querySelector('.total-shadow');
let startBtn = document.querySelector('.start-game-button');   // button to be pressed to start game

function createBalloon() {
	let div = document.createElement('div');              // creating div block for balloon
	let rand = Math.floor(Math.random()*colors.length);   // generating index to pick a random balloon from colors array
	div.className = 'balloon balloon-'+colors[rand];      //color of balloon added to class

	rand = Math.floor(Math.random() * (windowWidth - 100));  // generating random pixels to float balloons across te width
	div.style.left = rand + 'px';    // adding left px 
	div.dataset.number = currentBallon;    
	currentBallon++; 

	body.appendChild(div);       // appending balloon to body
	animateBalloon(div);         // calling animate balloon func
}

function animateBalloon(elem){
	let pos = 0; 
	let random = Math.floor(Math.random() * 6 - 3);
	let interval = setInterval(frame, 12 - Math.floor(num / 10) + random);

	function frame(){
		if(pos >= (windowHeight + 200) && (document.querySelector('[data-number="'+elem.dataset.number+'"]') !== null)) {
			clearInterval(interval);
			gameOver = true;
		} else{
			pos++;
			elem.style.top = windowHeight - pos + 'px';
		}
	}
}

function deleteBalloon(elem){
		elem.remove();         // deleting a balloon 
		num++;                 // incrementing the count of popped balloons 
		updateScore();         // to update score 
		playBallSound();       // to generate pop sound 
}

function playBallSound(){

	let audio = document.createElement('audio');     // audio to be played when balloon is popped
	audio.src = 'sounds/pop.mp3';
	audio.play();
}

function updateScore(){
	for(let i = 0; i < scores.length; i++){
		scores[i].textContent = num;
	}
}

function startGame(){
	restartGame();          // to delete all the exisiting balloons and score and initalise them to zero.
	let timeout = 0;

	let loop = setInterval(function(){
		timeout = Math.floor(Math.random() * 600 - 100);
		if(!gameOver && num !== total){
			createBalloon();                     // if game isn't over and popped balloons are less than total then we need to create another balloon
		} else if(num !== total) {
			clearInterval(loop);
			totalShadow.style.display = 'flex';  // if game is over and num!=total then display lose block
			totalShadow.querySelector('.lose').style.display = 'block';
		} else {
			clearInterval(loop); 
			totalShadow.style.display = 'flex';          // else display win block
			totalShadow.querySelector('.win').style.display = 'block';
		}
		
	}, 800 + timeout);
}

function restartGame(){
	let forRemoving = document.querySelectorAll('.balloon');
	for(let i = 0; i < forRemoving.length; i++){
		forRemoving[i].remove();             // if user restarts the game then we need to delete all balloons currently present on screen
	}
	gameOver = false;  // changing game over to false 
	num = 0;           // since the game is restarted
	updateScore();     // need to change curr score to zero
}

document.addEventListener('click', function(event){
	if(event.target.classList.contains('balloon')){
		deleteBalloon(event.target);      // calling delete function when clicked on balloon 
	}
})

document.querySelector('.restart').addEventListener('click', function(){
	totalShadow.style.display = 'none';
	totalShadow.querySelector('.win').style.display = 'none';   // starts game again if clicked on restart
	totalShadow.querySelector('.lose').style.display = 'none';

	startGame();
});

document.querySelector('.cancel').addEventListener('click', function(){
	totalShadow.style.display = 'none';
	restartGame();
	document.querySelector('.start-game-window').style.display = 'block';  // display start window when users clicks cancel for restaring
	document.querySelector('.new_bg').pause();  //pause the bg siund
	document.querySelector('.score-block').style.display='none';  //hiding the score block
});

startBtn.addEventListener('click', function() {     // to start the game when pressed on start buttoncl~~
	startGame();   
	document.querySelector('.new_bg').play();   // start the bg music
	document.querySelector('.start-game-window').style.display = 'none';  // hide start game window block
	document.querySelector('.score-block').style.display='flex';  // display score block when game is started
});