////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW=1280;
var stageH=768;
var contentW = 1024;
var contentH = 576;

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain(){
	if(!$.browser.mobile || !isTablet){
		$('#canvasHolder').show();	
	}
	
	initGameCanvas(stageW,stageH);
	buildGameCanvas();
	buildGameButton();
	if ( typeof buildScoreBoardCanvas == 'function' ) { 
		buildScoreBoardCanvas();
	}
	
	retrieveLevelData();
	createIsometricMap();
	goPage('main');
	
	resizeCanvas();
}

var windowW=windowH=0;
var scalePercent=0;
var offset = {x:0, y:0, left:0, top:0};

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc(){
	setTimeout(function() {
		$('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
		$('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));
		
		windowW = window.innerWidth;
		windowH = window.innerHeight;
		
		scalePercent = windowW/contentW;
		if((contentH*scalePercent)>windowH){
			scalePercent = windowH/contentH;
		}
		
		scalePercent = scalePercent > 1 ? 1 : scalePercent;
		
		if(windowW > stageW && windowH > stageH){
			if(windowW > stageW){
				scalePercent = windowW/stageW;
				if((stageH*scalePercent)>windowH){
					scalePercent = windowH/stageH;
				}	
			}
		}
		
		var newCanvasW = ((stageW)*scalePercent);
		var newCanvasH = ((stageH)*scalePercent);
		
		offset.left = 0;
		offset.top = 0;
		
		if(newCanvasW > windowW){
			offset.left = -((newCanvasW) - windowW);
		}else{
			offset.left = windowW - (newCanvasW);
		}
		
		if(newCanvasH > windowH){
			offset.top = -((newCanvasH) - windowH);
		}else{
			offset.top = windowH - (newCanvasH);	
		}
		
		offset.x = 0;
		offset.y = 0;
		
		if(offset.left < 0){
			offset.x = Math.abs((offset.left/scalePercent)/2);
		}
		if(offset.top < 0){
			offset.y = Math.abs((offset.top/scalePercent)/2);
		}
		
		$('canvas').css('width', newCanvasW);
		$('canvas').css('height', newCanvasH);
		
		$('canvas').css('left', (offset.left/2));
		$('canvas').css('top', (offset.top/2));
		
		$(window).scrollTop(0);
		
		resizeCanvas();
		if ( typeof resizeScore == 'function' ) { 
			resizeScore();
		}
	}, 100);	
}