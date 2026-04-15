////////////////////////////////////////////////////////////
// GAME v1.2
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var themeSettings = [
	{
		border:'#000',
		background:'#fff',
		colors:[
			{src:'assets/item_color_1a.png', color:'#dd1818'},
			{src:'assets/item_color_1b.png', color:'#f4c918'},
			{src:'assets/item_color_1c.png', color:'#11c12a'},
			{src:'assets/item_color_1d.png', color:'#0657ea'},
			{src:'assets/item_color_1e.png', color:'#a11bdb'},
			{src:'assets/item_color_1f.png', color:'#fb48c5'},
		]
	},
	{
		border:'#000',
		background:'#fff',
		colors:[
			{src:'assets/item_color_2a.png', color:'#dd1818'},
			{src:'assets/item_color_2b.png', color:'#f4c918'},
			{src:'assets/item_color_2c.png', color:'#11c12a'},
			{src:'assets/item_color_2d.png', color:'#0657ea'},
			{src:'assets/item_color_2e.png', color:'#a11bdb'},
			{src:'assets/item_color_2f.png', color:'#fb48c5'},
		]
	},
	{
		border:'#0073bc',
		background:'#000',
		colors:[
			{src:'assets/item_color_3a.png', color:'#dd1818'},
			{src:'assets/item_color_3b.png', color:'#f4c918'},
			{src:'assets/item_color_3c.png', color:'#11c12a'},
			{src:'assets/item_color_3d.png', color:'#0657ea'},
			{src:'assets/item_color_3e.png', color:'#a11bdb'},
			{src:'assets/item_color_3f.png', color:'#fb48c5'},
		]
	}
];

//game settings
var gameSettings = {
	pointRadius:30,
	guideSize:10,
	strokeSize:10, //hard / impossible to complete if higher
};

//game text display
var textDisplay = {
	selectLevel:'SELECT LEVEL',
	complete:'FRIVTASTIC!', //
	exitTitle:'EXIT GAME',
	exitMessage:'ARE YOU SURE\nYOU WANT TO\nQUIT?', //
	share:'SHARE YOUR SCORE:',
	resultTitle:'RESULTS', //
	resultComplete:'COMPLETED',
	resultDesc:'LEVEL [NUMBER]',
}

//Social share, [SCORE] will replace with game score
var shareEnable = false; //toggle share
var shareTitle = 'Highscore on Color Link is Level [SCORE]';//social share score title
var shareMessage = 'Level [SCORE] is mine new highscore on Color Link game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, levelNum:0, themeIndex:0, themeLoopIndex:0, themes:[], colors:[], colorIndex:0, lineData:{x:0, y:0}, drawGuideW:800, drawGuideH:500, levelCompleted:1};
var tweenData = {score:0, tweenScore:0};
var selectData = {page:0, total:1, max:20, column:5, row:4};
var cookieName = 'colorlink2024';

/*!
 * 
 * DATA UPDATE - This is the function that runs to update data
 * 
 */
function retrieveLevelData(){
	var curLevel = Cookies.get(cookieName);
	if(curLevel != undefined){
		gameData.levelCompleted = Number(curLevel);
		gameData.levelCompleted = gameData.levelCompleted >= levelSettings.length ? levelSettings.length : gameData.levelCompleted;
		findSelectPage(gameData.levelCompleted);
	}
}

function saveLevelData(){
	if(Number(gameData.levelNum) >= gameData.levelCompleted){
		gameData.levelCompleted = Number(gameData.levelNum)+1;
		gameData.levelCompleted = gameData.levelCompleted >= levelSettings.length ? levelSettings.length : gameData.levelCompleted;
		Cookies.set(cookieName, gameData.levelCompleted, {expires:360});
	}
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});
	
	if($.browser.mobile || isTablet){

	}else{
		
	}

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('level');
	});

	buttonLevelArrowL.cursor = "pointer";
	buttonLevelArrowL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleSelect(false);
	});

	buttonLevelArrowR.cursor = "pointer";
	buttonLevelArrowR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleSelect(true);
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('level');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	buttonRetry.cursor = "pointer";
	buttonRetry.addEventListener("click", function(evt) {
		resetColors();
	});

	for(var n=0; n<themeSettings.length; n++){
		gameData.themes.push(n);
	}
	gameData.themeLoopIndex = 0;
	shuffle(gameData.themes);

	setupStageEvents();
	buildSelectLevel();
}

/*!
 * 
 * SELECT LEVEL - This is the function that runs to display select levels
 * 
 */
function buildSelectLevel(){
	selectData.total = levelSettings.length/selectData.max;
	
	if (String(selectData.total).indexOf('.') > -1){
		selectData.total=Math.floor(selectData.total)+1;
	}
	toggleSelect(false);
	for(var r=0; r<selectData.row; r++){
		for(var c=0; c<selectData.column; c++){
			$.level[r+'_unlock_'+c].cursor = "pointer";
			$.level[r+'_unlock_'+c].addEventListener("click", function(evt) {
				gameData.levelNum = Number(evt.target.text.text) - 1;
				playSound('soundButton');
				goPage("game");
			});
		}
	}
}

function toggleSelect(con){
	if(con){
		selectData.page++;
		selectData.page = selectData.page > selectData.total ? selectData.total : selectData.page;
	}else{
		selectData.page--;
		selectData.page = selectData.page < 1 ? 1 : selectData.page;
	}
	selectPage(selectData.page);
}

function selectPage(num){
	selectData.page = num;
	selectData.page = selectData.page < 1 ? 1 : selectData.page;
	
	var startNum = (selectData.page-1) * selectData.max;
	for(var r=0; r<selectData.row; r++){
		for(var c=0; c<selectData.column; c++){
			$.level[r+'_unlock_'+c].visible = false;
			if(startNum < levelSettings.length){
				$.level[r+'_text_'+c].text = startNum+1;
				$.level[r+'_unlock_'+c].text.visible = true;
				$.level[r+'_'+c].visible = true;
			}else{
				$.level[r+'_'+c].visible = false;
				$.level[r+'_unlock_'+c].text.visible = false;
			}

			if((startNum) < gameData.levelCompleted){
				if(gameData.revealLevel && (gameData.levelNum+1) == $.level[r+'_text_'+c].text){
					unlockLevelTween(r,c);
				}else{
					$.level[r+'_unlock_'+c].visible = true;
				}
			}else{
				$.level[r+'_text_'+c].text = '';
			}
			startNum++;
		}
	}
	
	if(selectData.page == 1){
		buttonLevelArrowL.visible = false;
	}else{
		buttonLevelArrowL.visible = true;
	}
	
	if(selectData.page == selectData.total || selectData.total == 1){
		buttonLevelArrowR.visible = false;
	}else{
		buttonLevelArrowR.visible = true;
	}
}

function unlockLevelTween(r,c){
	gameData.revealLevel = false;
	$.level[r+'_unlock_'+c].visible = true;
	$.level[r+'_unlock_'+c].alpha = 0;
	$.level[r+'_text_'+c].alpha = 0;

	TweenMax.to($.level[r+'_unlock_'+c], .5, {delay:.5, alpha:1, scaleX:1.2, scaleY:1.2, overwrite:true, onStart:function(){
		playSound('soundUnlock');
	}, onComplete:function(){
		TweenMax.to($.level[r+'_unlock_'+c], .5, {scaleX:1, scaleY:1, overwrite:true});
	}});
	TweenMax.to($.level[r+'_text_'+c], .5, {delay:.5, alpha:1, overwrite:true});
}

function findSelectPage(level){
	for(var n=0; n<10; n++){
		var startNum = (n+1) * selectData.max;
		if(level <= startNum){
			selectData.page = n+1;
			n = 10;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	levelContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			stopMusicLoop('musicGame');
			playMusicLoop('musicMain');

		break;

		case 'level':
			targetContainer = levelContainer;
			selectPage(selectData.page);
		break;
		
		case 'game':
			targetContainer = gameContainer;
			if(!$.editor.enable){
				stopMusicLoop('musicMain');
				playMusicLoop('musicGame');
			}

			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);

			stopMusicLoop('musicGame');
			playSound('soundResult');

			playerData.score = gameData.levelNum;
			resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', gameData.levelNum)
			
			saveGame(playerData.score);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.drawing = false;
	gameData.complete = false;
	gameData.ready = false;

	gameData.themeIndex = gameData.themes[gameData.themeLoopIndex];
	gameData.themeLoopIndex++;
	if(gameData.themeLoopIndex > gameData.themes.length-1){
		gameData.themeLoopIndex = 0;
		shuffle(gameData.themes);
	}

	statusContainer.alpha = 0;
	statusInnerContainer.y = 0;

	if(!$.editor.enable){
		preparePuzzle();
		playSound('soundStart');
		buttonRetry.visible = true;
	}else{
		buttonRetry.visible = false;
		gameData.themeIndex = 0;
	}
}

function resizePuzzle(){
	levelContainer.x = canvasW/2;
	levelContainer.y = canvasH/2;

	puzzleContainer.x = canvasW/2;
	puzzleContainer.y = canvasH/2;

	statusContainer.x = canvasW/2;
	statusContainer.y = canvasH/2;

	buttonRetry.x = canvasW/100 * 86;
	buttonRetry.y = canvasH/2;

	buttonLevelArrowL.x = -260;
	buttonLevelArrowR.x = 260;

	if(viewport.isLandscape){
		puzzleContainer.rotation = 0;

		selectLevelTitleTxt.y = -(canvasH/100 * 25);
	}else{
		puzzleContainer.x = canvasW/2;
		puzzleContainer.y = canvasH/100 * 47;
		puzzleContainer.rotation = 90;

		selectLevelTitleTxt.y = -(canvasH/100 * 25);

		buttonRetry.x = canvasW/2;
		buttonRetry.y = canvasH/100*91;
	}

	if(curPage == 'game' && gameData.levelNum < levelSettings.length){
		for(var n=0; n<levelSettings[gameData.levelNum].colors.length; n++){
			if($.puzzle[n+'start'] != undefined){
				$.puzzle[n+'start'].rotation = 0;
				$.puzzle[n+'end'].rotation = 0;
	
				if(!viewport.isLandscape){
					$.puzzle[n+'start'].rotation = -90;
					$.puzzle[n+'end'].rotation = -90;
				}
			}
		}
	}
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){	
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * LOAD PUZZLE - This is the function that runs to load puzzle
 * 
 */
function preparePuzzle(){
	puzzleShapeContainer.removeAllChildren();
	puzzleColorContainer.removeAllChildren();
	puzzleEditContainer.removeAllChildren();

	gameData.pointRadius = gameSettings.pointRadius;
	gameData.strokeSize = gameSettings.strokeSize;

	gameData.puzzleIndex = -1;
	gameData.puzzleFromTarget = -1;

	gameData.colors = [];
	for(var n=0; n<themeSettings[gameData.themeIndex].colors.length; n++){
		gameData.colors.push(n);
	}
	if(!$.editor.enable){
		shuffle(gameData.colors);
	}

	drawGuide.graphics.clear().setStrokeStyle(gameSettings.guideSize).beginStroke(themeSettings[gameData.themeIndex].border).beginFill(themeSettings[gameData.themeIndex].background).drawRect(-(gameData.drawGuideW/2), -(gameData.drawGuideH/2), gameData.drawGuideW, gameData.drawGuideH);

	for(var n=0; n<levelSettings[gameData.levelNum].obstacles.length; n++){
		var lineArr = [];
		$.puzzle[n+'obstacle'] = new createjs.Shape();
		$.puzzle[n+'obstacle'].graphics.setStrokeStyle(gameSettings.guideSize,'round','round').beginStroke(themeSettings[gameData.themeIndex].border)
		.mt(levelSettings[gameData.levelNum].obstacles[n][0].x, levelSettings[gameData.levelNum].obstacles[n][0].y);
		$.puzzle[n+'obstacle'].points = [];
		puzzleColorContainer.addChild($.puzzle[n+'obstacle']);

		for(var p=0; p<levelSettings[gameData.levelNum].obstacles[n].length; p++){
			$.puzzle[n+'point'+p] = new createjs.Shape();
			$.puzzle[n+'point'+p].x = levelSettings[gameData.levelNum].obstacles[n][p].x;
			$.puzzle[n+'point'+p].y = levelSettings[gameData.levelNum].obstacles[n][p].y;

			$.puzzle[n+'point'+p].linkIndex = n;
			$.puzzle[n+'point'+p].linkPoint = p;

			$.puzzle[n+'point'+p].cursor = "pointer";

			$.puzzle[n+'obstacle'].graphics.lt(levelSettings[gameData.levelNum].obstacles[n][p].x, levelSettings[gameData.levelNum].obstacles[n][p].y);
			puzzleEditContainer.addChild($.puzzle[n+'point'+p]);

			lineArr.push({x:levelSettings[gameData.levelNum].obstacles[n][p].x, y:levelSettings[gameData.levelNum].obstacles[n][p].y})
		}
		insertObstaclePoints(n, lineArr);
	}

	for(var n=0; n<levelSettings[gameData.levelNum].colors.length; n++){
		var colorIndex = gameData.colors[n];
		var shapeColor = themeSettings[gameData.themeIndex].colors[colorIndex].color;

		$.puzzle[n] = {
			color:shapeColor,
			shape:null,
			points:[],
			complete:false
		};

		$.puzzle[n+'start'] = new createjs.Bitmap(loader.getResult('puzzleColor'+gameData.themeIndex+'_'+colorIndex));
		centerReg($.puzzle[n+'start']);
		$.puzzle[n+'start'].x = levelSettings[gameData.levelNum].colors[n].sX;
		$.puzzle[n+'start'].y = levelSettings[gameData.levelNum].colors[n].sY;

		$.puzzle[n+'end'] = new createjs.Bitmap(loader.getResult('puzzleColor'+gameData.themeIndex+'_'+colorIndex));
		centerReg($.puzzle[n+'end']);
		$.puzzle[n+'end'].x = levelSettings[gameData.levelNum].colors[n].eX;
		$.puzzle[n+'end'].y = levelSettings[gameData.levelNum].colors[n].eY;

		$.puzzle[n+'start'].linkTarget = 0;
		$.puzzle[n+'start'].linkIndex = n;

		$.puzzle[n+'end'].linkTarget = 1;
		$.puzzle[n+'end'].linkIndex = n;

		$.puzzle[n+'start'].cursor = "pointer";
		$.puzzle[n+'start'].addEventListener("mousedown", function(evt) {
			if($.puzzle[evt.target.linkIndex].complete){
				return;
			}

			gameData.puzzleIndex = evt.target.linkIndex;
			gameData.puzzleFromTarget = evt.target.linkTarget;
			animateSelect(evt.target, .2);
			startDrawing();
		});

		$.puzzle[n+'end'].cursor = "pointer";
		$.puzzle[n+'end'].addEventListener("mousedown", function(evt) {
			if($.puzzle[evt.target.linkIndex].complete){
				return;
			}

			gameData.puzzleIndex = evt.target.linkIndex;
			gameData.puzzleFromTarget = evt.target.linkTarget;
			animateSelect(evt.target, .2);
			startDrawing();
		});

		if(!$.editor.enable){
			animateFocus($.puzzle[n+'start'], 1);
			animateFocus($.puzzle[n+'end'], 1);
		}

		puzzleColorContainer.addChild($.puzzle[n+'start'], $.puzzle[n+'end']);
	}
}

function insertObstaclePoints(n, lineArr){
	var posData = {x:levelSettings[gameData.levelNum].obstacles[n][0].x, y:levelSettings[gameData.levelNum].obstacles[n][0].y, lastX:levelSettings[gameData.levelNum].obstacles[n][0].x, lastY:levelSettings[gameData.levelNum].obstacles[n][0].y};
	TweenMax.to(posData, 1, {bezier:{type:"thru", values:lineArr, curviness:0, autoRotate:true}, ease:Linear.easeNone, overwrite:true, onUpdate:function(){
		var checkPointDistance = getDistance(posData.lastX, posData.lastY, posData.x, posData.y);
		if(checkPointDistance > gameData.strokeSize){
			$.puzzle[n+'obstacle'].points.push({x:posData.x, y:posData.y});
			posData.lastX = posData.x;
			posData.lastY = posData.y;
		}
	}});
}

/*!
 * 
 * STAGE EVENTS - This is the function that runs to build stage events
 * 
 */
function setupStageEvents(){
	stage.addEventListener("mousedown", function(evt) {
		toggleStageEvent(evt, 'down')
	});
	
	stage.addEventListener("pressmove", function(evt) {
		toggleStageEvent(evt, 'move')
	});

	stage.addEventListener("pressup", function(evt) {
		toggleStageEvent(evt, 'release')
	});
}

function removeStageEvents(){
	stage.removeAllEventListeners("mousedown");
	stage.removeAllEventListeners("pressmove");
	stage.removeAllEventListeners("pressup");
}

/*!
 * 
 * TOGGLE STEGE EVENTS - This is the function that runs to toggle stage events
 * 
 */
function toggleStageEvent(obj, con){
	if($.editor.enable){
		return;
	}

	switch(con){
		case 'down':

		break;

		case 'move':
			if (gameData.drawing) {
				updateDrawing();
			}
		break;
		
		case 'release':
			if (gameData.drawing) {
				removeDrawing();
			}
		break;
	}
}

/*!
 * 
 * DRWAING GUIDE - This is the function that runs to follow drawing guide
 * 
 */

function startDrawing(){
	playSound('soundSelect');
	gameData.drawing = true;

	var startPos = puzzleContainer.globalToLocal(stage.mouseX, stage.mouseY);
	gameData.lineData.x = startPos.x;
	gameData.lineData.y = startPos.y;

	$.puzzle[gameData.puzzleIndex].shape = new createjs.Shape();
	puzzleShapeContainer.addChild($.puzzle[gameData.puzzleIndex].shape);

	$.puzzle[gameData.puzzleIndex].points = [];
	$.puzzle[gameData.puzzleIndex].points.push({x:startPos.x, y:startPos.y});
}

function updateDrawing(){
	var movePos = puzzleContainer.globalToLocal(stage.mouseX, stage.mouseY);

	var drawGuideSize = gameSettings.guideSize;
	movePos.x = movePos.x <= -(gameData.drawGuideW/2 - drawGuideSize) ? -(gameData.drawGuideW/2 - drawGuideSize) : movePos.x;
	movePos.x = movePos.x >= (gameData.drawGuideW/2 - drawGuideSize) ? (gameData.drawGuideW/2 - drawGuideSize) : movePos.x;
	movePos.y = movePos.y <= -(gameData.drawGuideH/2 - drawGuideSize) ? -(gameData.drawGuideH/2 - drawGuideSize) : movePos.y;
	movePos.y = movePos.y >= (gameData.drawGuideH/2 - drawGuideSize) ? (gameData.drawGuideH/2 - drawGuideSize) : movePos.y;

	$.puzzle[gameData.puzzleIndex].shape.graphics.ss(gameData.strokeSize, "round").s($.puzzle[gameData.puzzleIndex].color);
	$.puzzle[gameData.puzzleIndex].shape.graphics.mt(gameData.lineData.x, gameData.lineData.y);        
	$.puzzle[gameData.puzzleIndex].shape.graphics.lt(movePos.x, movePos.y);
	
	gameData.lineData.x = movePos.x;
	gameData.lineData.y = movePos.y;

	var checkPointDistance = getDistance($.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].x, $.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].y, movePos.x, movePos.y);
	if(checkPointDistance > gameData.strokeSize){
		var angleNum = getDirection($.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].x, $.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].y, movePos.x, movePos.y);
		var totalLoop = 100;
		for(var n=0; n<totalLoop; n++){
			var point = getAnglePosition($.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].x, $.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].y, gameData.strokeSize, angleNum);
			$.puzzle[gameData.puzzleIndex].points.push({x:point.x, y:point.y});

			var collisionHit = false;
			for(var n=0; n<levelSettings[gameData.levelNum].obstacles.length; n++){		
				for(var p=0; p<$.puzzle[n+'obstacle'].points.length; p++){
					var checkCollisionDistance = getDistance($.puzzle[n+'obstacle'].points[p].x, $.puzzle[n+'obstacle'].points[p].y, point.x, point.y);
					if(checkCollisionDistance <= gameData.strokeSize){
						collisionHit = true;
					}
				}
			}

			for(var n=0; n<levelSettings[gameData.levelNum].colors.length; n++){
				if(n != gameData.puzzleIndex){
					var checkCollisionDistance = getDistance($.puzzle[n+'start'].x, $.puzzle[n+'start'].y, point.x, point.y);
					if(checkCollisionDistance <= (gameData.strokeSize/2) + gameSettings.pointRadius){
						collisionHit = true;
					}

					var checkCollisionDistance = getDistance($.puzzle[n+'end'].x, $.puzzle[n+'end'].y, point.x, point.y);
					if(checkCollisionDistance <= (gameData.strokeSize/2) + gameSettings.pointRadius){
						collisionHit = true;
					}
					
					for(var p=0; p<$.puzzle[n].points.length; p++){
						var checkCollisionDistance = getDistance($.puzzle[n].points[p].x, $.puzzle[n].points[p].y, point.x, point.y);
						if(checkCollisionDistance <= gameData.strokeSize){
							collisionHit = true;
						}
					}
				}
			}

			if(collisionHit){
				playSound('soundError');
				removeDrawing();
				return;
			}else{
				var targetObject = gameData.puzzleFromTarget == 0 ? gameData.puzzleIndex + 'end' : gameData.puzzleIndex + 'start';
				var checkTargetDistance = getDistance(movePos.x, movePos.y, $.puzzle[targetObject].x, $.puzzle[targetObject].y);
				if(checkTargetDistance <= gameData.pointRadius){
					playSound('soundConnect');
					gameData.drawing = false;
					$.puzzle[gameData.puzzleIndex].complete = true;
					animateSelect($.puzzle[gameData.puzzleIndex+'start'], .2);
					animateSelect($.puzzle[gameData.puzzleIndex+'end'], .2);
					checkPuzzleComplete();
					return;
				}
			}

			var checkPointDistance = getDistance($.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].x, $.puzzle[gameData.puzzleIndex].points[$.puzzle[gameData.puzzleIndex].points.length-1].y, movePos.x, movePos.y);
			if(checkPointDistance < gameData.strokeSize){
				return;
			}
		}
	}
}

function removeDrawing(){
	gameData.drawing = false;
	puzzleShapeContainer.removeChild($.puzzle[gameData.puzzleIndex].shape);
	$.puzzle[gameData.puzzleIndex].points = [];
}

function checkPuzzleComplete(){
	var puzzleComplete = 0;
	for(var n=0; n<levelSettings[gameData.levelNum].colors.length; n++){
		if($.puzzle[n].complete){
			puzzleComplete++;
		}
	}

	if(puzzleComplete == levelSettings[gameData.levelNum].colors.length){
		endGame();
	}
}

function resetColors(){
	if(gameData.complete){
		return;
	}

	playSound('soundReset');
	gameData.drawing = false;
	puzzleShapeContainer.removeAllChildren();
	
	for(var n=0; n<levelSettings[gameData.levelNum].colors.length; n++){
		$.puzzle[n].complete = false;
		$.puzzle[n].points = [];
	}
}

/*!
 * 
 * ANIMATE ICON - This is the function that runs to animate icon
 * 
 */
function animateFocus(obj, speed){
	obj.scaleX = obj.scaleY = 0;
	TweenMax.to(obj, speed, {scaleX:1, scaleY:1, ease:Bounce.easeOut, overwrite:true});	
}

function animateSelect(obj, speed){
	TweenMax.to(obj, speed, {scaleX:1.2, scaleY:1.2, ease:Sine.easeIn, overwrite:true, onComplete:function(){
		TweenMax.to(obj, speed, {scaleX:1, scaleY:1, ease:Sine.easeOut, overwrite:true});	
	}});
}


/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused && !$.editor.enable){
		
	}
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	playSound('soundComplete');
	gameData.paused = true;
	gameData.complete = true;
	buttonRetry.visible = false;
	
	gameData.revealLevel = false;
	gameData.levelNum++;
	if(gameData.levelNum >= gameData.levelCompleted && gameData.levelNum < levelSettings.length){
		gameData.revealLevel = true;
	}
	var nextLevel = gameData.levelNum+1;
	nextLevel = nextLevel > levelSettings.length ? levelSettings.length : nextLevel;
	findSelectPage(nextLevel);
	saveLevelData();
	
	TweenMax.to(statusContainer, 1, {alpha:1, overwrite:true});
	TweenMax.to(statusInnerContainer, 1, {alpha:1, y:0, ease:Expo.easeOut, overwrite:true, onComplete:function(){
		TweenMax.to(statusInnerContainer, 1, {alpha:0, ease:Expo.easeIn, overwrite:true, onComplete:function(){
			TweenMax.to(statusInnerContainer, 1, {overwrite:true, onComplete:function(){
				goPage('result')
			}});
		}});
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}