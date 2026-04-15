////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, instructionContainer, mapContainer, objectsContainer, resultContainer, scoreContainer, moveContainer, confirmContainer;
var guideline, bg, logo, buttonOk, result, shadowResult, buttonReplay, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.puzzle = {};
$.level = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	levelContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	statusContainer = new createjs.Container();
	statusInnerContainer = new createjs.Container();
	puzzleContainer = new createjs.Container();
	puzzleColorContainer = new createjs.Container();
	puzzleEditContainer = new createjs.Container();
	puzzleShapeContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	bgP = new createjs.Bitmap(loader.getResult('backgroundP'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	centerReg(logo);
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);

	//select
	//levels
	//level
	var levelData = {sX:0, sY:0, x:0, y:0, space:5, size:80, count:0};
	var totalW = (selectData.column-1) * levelData.size;
	totalW += (selectData.column-1) * levelData.space;
	var totalH = (selectData.row-1) * levelData.size;
	totalH += (selectData.row-1) * levelData.space;

	levelData.sX = -(totalW/2);
	levelData.sY = -(totalH/2);
	levelData.y = levelData.sY;

	for(var r=0; r<selectData.row; r++){
		levelData.x = levelData.sX;
		for(var c=0; c<selectData.column; c++){
			$.level[r+'_'+c] = new createjs.Bitmap(loader.getResult('itemLevelLock'));
			centerReg($.level[r+'_'+c]);
			$.level[r+'_'+c].x = levelData.x;
			$.level[r+'_'+c].y = levelData.y;

			$.level[r+'_unlock_'+c] = new createjs.Bitmap(loader.getResult('itemLevel'));
			centerReg($.level[r+'_unlock_'+c]);
			$.level[r+'_unlock_'+c].x = levelData.x;
			$.level[r+'_unlock_'+c].y = levelData.y;

			$.level[r+'_text_'+c] = new createjs.Text();
			$.level[r+'_text_'+c].font = "25px multicolore";
			$.level[r+'_text_'+c].color = '#fff';
			$.level[r+'_text_'+c].textAlign = "center";
			$.level[r+'_text_'+c].textBaseline='alphabetic';
			$.level[r+'_text_'+c].x = levelData.x;
			$.level[r+'_text_'+c].y = levelData.y + 12;
			$.level[r+'_text_'+c].hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0,0,0,0));	

			$.level[r+'_unlock_'+c].text = $.level[r+'_text_'+c];

			levelContainer.addChild($.level[r+'_'+c], $.level[r+'_unlock_'+c], $.level[r+'_text_'+c]);
			
			levelData.x += levelData.size + levelData.space;
			levelData.count++;
		}
		levelData.y += levelData.size + levelData.space;
	}

	selectLevelTitleTxt = new createjs.Text();
	selectLevelTitleTxt.font = "30px multicolore";
	selectLevelTitleTxt.color = '#0073bc';
	selectLevelTitleTxt.textAlign = "center";
	selectLevelTitleTxt.textBaseline='alphabetic';
	selectLevelTitleTxt.text = textDisplay.selectLevel;

	buttonLevelArrowL = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonLevelArrowL);
	buttonLevelArrowL.scaleX = -1;
	buttonLevelArrowR = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonLevelArrowR);

	levelContainer.addChild(selectLevelTitleTxt, buttonLevelArrowL, buttonLevelArrowR);
	
	//game
	drawGuide = new createjs.Shape();

	buttonRetry = new createjs.Bitmap(loader.getResult('buttonRetry'));
	centerReg(buttonRetry);

	itemStatus = new createjs.Bitmap(loader.getResult('itemStatus'));
	centerReg(itemStatus);

	statusTxt = new createjs.Text();
	statusTxt.font = "22px multicolore";
	statusTxt.color = '#0073bc';
	statusTxt.textAlign = "center";
	statusTxt.textBaseline='alphabetic';
	statusTxt.text = textDisplay.complete;
	statusTxt.y = 10;

	statusInnerContainer.addChild(itemStatus, statusTxt);
	statusContainer.addChild(statusInnerContainer);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	itemResultP = new createjs.Bitmap(loader.getResult('itemResultP'));
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "18px multicolore";
	resultShareTxt.color = '#0e416f';
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "25px multicolore";
	resultTitleTxt.color = '#fff';
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = textDisplay.resultTitle;

	resultCompleteTxt = new createjs.Text();
	resultCompleteTxt.font = "28px multicolore";
	resultCompleteTxt.color = '#0e416f';
	resultCompleteTxt.textAlign = "center";
	resultCompleteTxt.textBaseline='alphabetic';
	resultCompleteTxt.text = textDisplay.resultComplete;
	
	resultDescTxt = new createjs.Text();
	resultDescTxt.font = "40px multicolore";
	resultDescTxt.lineHeight = 45;
	resultDescTxt.color = '#0073bc';
	resultDescTxt.textAlign = "center";
	resultDescTxt.textBaseline='alphabetic';
	resultDescTxt.text = '';
	
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	itemExitP = new createjs.Bitmap(loader.getResult('itemExitP'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	
	popTitleTxt = new createjs.Text();
	popTitleTxt.font = "25px multicolore";
	popTitleTxt.color = "#fff";
	popTitleTxt.textAlign = "center";
	popTitleTxt.textBaseline='alphabetic';
	popTitleTxt.text = textDisplay.exitTitle;
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "25px multicolore";
	popDescTxt.color = "#0073bc";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = textDisplay.exitMessage;
	
	confirmContainer.addChild(itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel);
	confirmContainer.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, buttonStart);
	puzzleContainer.addChild(drawGuide, puzzleShapeContainer, puzzleColorContainer, puzzleEditContainer);
	gameContainer.addChild(puzzleContainer, buttonRetry, statusContainer);
	resultContainer.addChild(itemResult, itemResultP, buttonContinue, resultTitleTxt, resultDescTxt, resultCompleteTxt);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, bgP, mainContainer, levelContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
}

function changeViewport(isLandscape){
	if(isLandscape){
		//landscape
		stageW=landscapeSize.w;
		stageH=landscapeSize.h;
		contentW = landscapeSize.cW;
		contentH = landscapeSize.cH;
	}else{
		//portrait
		stageW=portraitSize.w;
		stageH=portraitSize.h;
		contentW = portraitSize.cW;
		contentH = portraitSize.cH;
	}
	
	gameCanvas.width = stageW;
	gameCanvas.height = stageH;
	
	canvasW=stageW;
	canvasH=stageH;
	
	changeCanvasViewport();
}

function changeCanvasViewport(){
	if(canvasContainer!=undefined){
		logo.scaleX = logo.scaleY = 1;
		
		if(viewport.isLandscape){
			bg.visible = true;
			bgP.visible = false;
			
			logo.x = canvasW/2;
			logo.y = canvasW/100 * 25;
			
			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 68;
			
			//game
			
			//result
			itemResult.visible = true;
			itemResultP.visible = false;
			
			buttonFacebook.x = canvasW/100*44;
			buttonFacebook.y = canvasH/100*57;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*57;
			buttonWhatsapp.x = canvasW/100*56;
			buttonWhatsapp.y = canvasH/100*57;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 67;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 52;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 30;

			resultCompleteTxt.x = canvasW/2;
			resultCompleteTxt.y = canvasH/100 * 39;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 46;
			
			//exit
			itemExit.visible = true;
			itemExitP.visible = false;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 57);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 66);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 30;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 42;
		}else{
			bg.visible = false;
			bgP.visible = true;
			
			logo.x = canvasW/2;
			logo.y = canvasW/100 * 55;
			logo.scaleX = logo.scaleY = .8;
			
			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 68;
			
			//game
			
			//result
			itemResult.visible = false;
			itemResultP.visible = true;
			
			buttonFacebook.x = canvasW/100*40;
			buttonFacebook.y = canvasH/100*55;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*55;
			buttonWhatsapp.x = canvasW/100*60;
			buttonWhatsapp.y = canvasH/100*55;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 63;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 51;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 35;

			resultCompleteTxt.x = canvasW/2;
			resultCompleteTxt.y = canvasH/100 * 42;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 47;
			
			//exit
			itemExit.visible = false;
			itemExitP.visible = true;

			buttonConfirm.x = (canvasW/2);
			buttonConfirm.y = (canvasH/100 * 55);
			
			buttonCancel.x = (canvasW/2);
			buttonCancel.y = (canvasH/100 * 62);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 35;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 43;
		}
	}
}



/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 105;  //was 45 and then added 60
		
		var distanceNum = 60;
		var nextCount = 0;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x + 999; //
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x + 999; //
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+1)); //
			
		}

		resizePuzzle();
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	if(obj.image == undefined){
		return;
	}

	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}