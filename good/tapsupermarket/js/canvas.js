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

$.objects = {};
$.items = {};
$.interior = {};
$.peoples = {};
$.peopleList = {};
$.welcome = {};
$.stars = {};

var numbers_arr = [{id:0, regX:19, regY:110, width:47},
						{id:1, regX:19, regY:107, width:37},
						{id:2, regX:20, regY:112, width:46},
						{id:3, regX:19, regY:115, width:47},
						{id:4, regX:20, regY:114, width:47},
						{id:5, regX:19, regY:116, width:47},
						{id:6, regX:19, regY:116, width:47},
						{id:7, regX:17, regY:117, width:47},
						{id:8, regX:19, regY:110, width:47},
						{id:9, regX:19, regY:110, width:47},
						{id:'Comma', regX:16, regY:41, width:22}];

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	mapContainer = new createjs.Container();
	moveContainer = new createjs.Container();
	iconContainer = new createjs.Container();
	progressContainer = new createjs.Container();
	expandContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	instructionContainer = new createjs.Container();
	objectsContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	scoreContainer = new createjs.Container();objects_arr
	confirmContainer = new createjs.Container();
	
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	shadowMain = new createjs.Bitmap(loader.getResult('shadowMain'));
	buttonNew = new createjs.Bitmap(loader.getResult('buttonNew'));
	centerReg(buttonNew);
	buttonNew.x = canvasW/2;
	buttonNew.y = canvasH/100 * 70;
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	buttonContinue.x = canvasW/2;
	buttonContinue.y = canvasH/100 * 80;
	
	for(n=0;n<instruction_arr.length;n++){
		$.welcome[n] = new createjs.Bitmap(loader.getResult('welcome'+n));
		createHitarea($.welcome[n]);
		instructionContainer.addChild($.welcome[n]);
	}
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/100 * 63.5;
	buttonStart.y = canvasH/100 * 70;
	
	buttonArrowL = new createjs.Bitmap(loader.getResult('buttonArrowL'));
	centerReg(buttonArrowL);
	buttonArrowL.x = canvasW/100 * 33;
	buttonArrowL.y = canvasH/100 * 70;
	
	buttonArrowR = new createjs.Bitmap(loader.getResult('buttonArrowR'));
	centerReg(buttonArrowR);
	buttonArrowR.x = canvasW/100 * 39;
	buttonArrowR.y = canvasH/100 * 70;
	
	instructionContainer.addChild(buttonStart, buttonArrowL, buttonArrowR);
	
	shop = new createjs.Bitmap(loader.getResult('shop'));
	moveData.width = shop.image.naturalWidth;
	moveData.height = shop.image.naturalHeight;
	shopsign = new createjs.Bitmap(loader.getResult('shopsign'));
	
	for(n=0;n<objects_arr.length;n++){
		if(objects_arr[n].count > 0){
			var _frame = {"regX":objects_arr[n].regX, "regY":objects_arr[n].regY, "count":objects_arr[n].count, "width": objects_arr[n].width, "height":objects_arr[n].height};
			var _animations = {};

			stallData = new createjs.SpriteSheet({
				"images": [loader.getResult(objects_arr[n].id).src],
				"frames": _frame,
				"animations": _animations
			});

			$.objects[objects_arr[n].id] = new createjs.Sprite(stallData, "full");
			$.objects[objects_arr[n].id].framerate = 20;
			$.objects[objects_arr[n].id].totalFrames = objects_arr[n].count;
			$.objects[objects_arr[n].id].gotoAndStop(objects_arr[n].count-1);
			$.objects[objects_arr[n].id].x = -objects_arr[n].width;
		}else{
			$.objects[objects_arr[n].id] = new createjs.Bitmap(loader.getResult(objects_arr[n].id));
			$.objects[objects_arr[n].id].regX = objects_arr[n].regX;
			$.objects[objects_arr[n].id].regY = objects_arr[n].regY;
			$.objects[objects_arr[n].id].x = -objects_arr[n].width;
		}
		
		$.objects[objects_arr[n].id].oriW = objects_arr[n].width;
		$.objects[objects_arr[n].id].oriH = objects_arr[n].height;
		
		gameContainer.addChild($.objects[objects_arr[n].id]);
	}
	
	for(n=0;n<people_arr.length;n++){		
		var _frameW=30;
		var _frameH=50;
		var _frame = {"regX":15, "regY":48, "height":_frameH, "count":4, "width": _frameW};
		var _animations = {l:{frames: [0]},
							d:{frames: [1]},
							r:{frames: [3]},
							u:{frames: [2]}};
										
		humanData = new createjs.SpriteSheet({
			"images": [loader.getResult('people'+n).src],
			"frames": _frame,
			"animations": _animations
		});
		
		$.peoples[n] = new createjs.Sprite(humanData, "l");
		$.peoples[n].framerate = 20;
		$.peoples[n].x = -100;
		
		gameContainer.addChild($.peoples[n]);
	}
	
	itemAngry = new createjs.Bitmap(loader.getResult('itemAngry'));
	centerReg(itemAngry);
	itemAngry.visible = false;
	gameContainer.addChild(itemAngry);
	
	itemRestock = new createjs.Bitmap(loader.getResult('itemRestock'));
	centerReg(itemRestock);
	itemRestock.visible = false;
	gameContainer.addChild(itemRestock);
	
	for(n=0;n<staff_arr.length;n++){		
		var _frameW=48;
		var _frameH=50;
		var _frame = {"regX":24, "regY":48, "height":_frameH, "count":8, "width": _frameW};
		var _animations = {l:{frames: [0]},
							d:{frames: [1]},
							r:{frames: [3]},
							u:{frames: [2]},
						  	cl:{frames: [4]},
							cd:{frames: [5]},
							cr:{frames: [7]},
							cu:{frames: [6]}};
										
		humanData = new createjs.SpriteSheet({
			"images": [loader.getResult('staff'+n).src],
			"frames": _frame,
			"animations": _animations
		});
		
		$.peoples['staff_'+n] = new createjs.Sprite(humanData, "l");
		$.peoples['staff_'+n].framerate = 20;
		$.peoples['staff_'+n].x = -100;
		
		gameContainer.addChild($.peoples['staff_'+n]);
	}
	
	displayContainer = new createjs.Container();
	gameDisplay = new createjs.Bitmap(loader.getResult('gameDisplay'));
	
	scoreTxt = new createjs.Text();
	scoreTxt.font = "23px the_bold_fontbold";
	scoreTxt.color = "#025a82";
	scoreTxt.textAlign = "right";
	scoreTxt.textBaseline='alphabetic';
	scoreTxt.text = '$100';
	scoreTxt.x = 150;
	scoreTxt.y = 28
	
	displayContainer.addChild(gameDisplay, scoreTxt);
	
	var startX = 68;
	var startY = 46;
	var spaceX = 15;
	
	for(var n=0; n<5; n++){
		$.stars[n] = new createjs.Bitmap(loader.getResult('gameDisplayStar'));
		centerReg($.stars[n]);
		$.stars[n].x = startX;
		$.stars[n].y = startY;
		startX += spaceX;
		displayContainer.addChild($.stars[n]);
	}
	
	itemExpand = new createjs.Bitmap(loader.getResult('itemExpand'));
	itemExpand.regX = 69;
	itemExpand.regY = 188;
	
	expandNameTxt = new createjs.Text();
	expandNameTxt.font = "20px the_bold_fontbold";
	expandNameTxt.color = "#025a82";
	expandNameTxt.textAlign = "center";
	expandNameTxt.textBaseline='alphabetic';
	expandNameTxt.text = 'DAILY';
	expandNameTxt.y = -158;
	
	expandCostTxt = new createjs.Text();
	expandCostTxt.font = "30px the_bold_fontbold";
	expandCostTxt.color = "#fff";
	expandCostTxt.textAlign = "center";
	expandCostTxt.textBaseline='alphabetic';
	expandCostTxt.text = '$500';
	expandCostTxt.y = -115;
	
	buttonBuy = new createjs.Bitmap(loader.getResult('buttonBuy'));
	centerReg(buttonBuy);
	buttonBuyDisabled = new createjs.Bitmap(loader.getResult('buttonBuyDisabled'));
	centerReg(buttonBuyDisabled);
	buttonBuy.y = -45;
	
	buttonBuyDisabled.x = buttonBuy.x;
	buttonBuyDisabled.y = buttonBuy.y;
	
	expandContainer.addChild(itemExpand, expandNameTxt, expandCostTxt, buttonBuyDisabled, buttonBuy);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px the_bold_fontbold";
	resultTitleTxt.color = "#025a82";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = textDisplay.resultTitle;
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 33;
	
	resultEarnTxt = new createjs.Text();
	resultEarnTxt.font = "40px the_bold_fontbold";
	resultEarnTxt.color = "#025a82";
	resultEarnTxt.textAlign = "left";
	resultEarnTxt.textBaseline='alphabetic';
	resultEarnTxt.text = textDisplay.resultEarn;
	resultEarnTxt.x = canvasW/100 * 40;
	resultEarnTxt.y = canvasH/100 * 40;
	
	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "40px the_bold_fontbold";
	resultScoreTxt.color = "#23bb31";
	resultScoreTxt.textAlign = "left";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.text = textDisplay.resultEarn;
	resultScoreTxt.x = canvasW/100 * 50;
	resultScoreTxt.y = canvasH/100 * 40;
	
	resultRateTxt = new createjs.Text();
	resultRateTxt.font = "40px the_bold_fontbold";
	resultRateTxt.color = "#025a82";
	resultRateTxt.textAlign = "left";
	resultRateTxt.textBaseline='alphabetic';
	resultRateTxt.text = textDisplay.resultRate;
	resultRateTxt.x = canvasW/100 * 40;
	resultRateTxt.y = canvasH/100 * 46;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "25px the_bold_fontbold";
	resultShareTxt.color = "#999";
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100 * 52;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	buttonFacebook.x = canvasW/100*45;
	buttonFacebook.y = canvasH/100*57;
	buttonTwitter.x = canvasW/2;
	buttonTwitter.y = canvasH/100*57;
	buttonWhatsapp.x = canvasW/100*55;
	buttonWhatsapp.y = canvasH/100*57;
	
	buttonResultContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonResultContinue);
	buttonResultContinue.x = canvasW/2;
	buttonResultContinue.y = canvasH/100 * 68;
	
	resultStarContainer = new createjs.Container();
	var startX = canvasW/100 * 51;
	var startY = canvasH/100 * 44;
	var spaceX = 38;
	for(var n=0; n<5; n++){
		$.stars['result'+n] = new createjs.Bitmap(loader.getResult('itemResultStar'));
		$.stars['resultNone'+n] = new createjs.Bitmap(loader.getResult('itemResultStarDisabled'));
		
		centerReg($.stars['result'+n]);
		$.stars['result'+n].x = startX;
		$.stars['result'+n].y = startY;
		
		centerReg($.stars['resultNone'+n]);
		$.stars['resultNone'+n].x = startX;
		$.stars['resultNone'+n].y = startY;
		startX += spaceX;
		
		resultStarContainer.addChild($.stars['resultNone'+n], $.stars['result'+n]);
	}
	
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
	itemPop = new createjs.Bitmap(loader.getResult('itemPop'));
	
	buttonYes = new createjs.Bitmap(loader.getResult('buttonYes'));
	centerReg(buttonYes);
	buttonYes.x = canvasW/100 * 41;
	buttonYes.y = canvasH/100 * 59;
	
	buttonNo = new createjs.Bitmap(loader.getResult('buttonNo'));
	centerReg(buttonNo);
	buttonNo.x = canvasW/100 * 59;
	buttonNo.y = canvasH/100 * 59;
	
	popTitleTxt = new createjs.Text();
	popTitleTxt.font = "50px the_bold_fontbold";
	popTitleTxt.color = "#025a82";
	popTitleTxt.textAlign = "center";
	popTitleTxt.textBaseline='alphabetic';
	popTitleTxt.text = 'NEW GAME';
	popTitleTxt.x = canvasW/2;
	popTitleTxt.y = canvasH/100 * 43;
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "20px the_bold_fontbold";
	popDescTxt.color = "#666";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = 'NEW GAME';
	popDescTxt.lineHeight = 25;
	popDescTxt.x = canvasW/2;
	popDescTxt.y = canvasH/100 * 48;
	
	confirmContainer.addChild(itemPop, popTitleTxt, popDescTxt, buttonYes, buttonNo);
	confirmContainer.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();	
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(shadowMain, logo, buttonNew, buttonContinue);
	instructionContainer.visible = false;
	
	moveContainer.addChild(shop, mapContainer, objectsContainer, shopsign, iconContainer, progressContainer, expandContainer);
	gameContainer.addChild(moveContainer, displayContainer, instructionContainer);
	resultContainer.addChild(itemResult, resultTitleTxt, resultEarnTxt, resultScoreTxt, resultRateTxt, resultStarContainer, buttonResultContinue);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, mainContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		displayContainer.y = canvasH - (offset.y + 80);
		displayContainer.x = (offset.x + 30);
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 105;  //was 45 and then added 60
		
		var distanceNum = 55;
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
			
			buttonFullscreen.x = buttonSettings.x + 999;
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
			
			buttonFullscreen.x = buttonSettings.x + 999;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}
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
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}