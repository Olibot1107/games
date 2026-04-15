////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_new.png', id:'buttonNew'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/interior_shop.png', id:'shop'},
			{src:'assets/interior_sign.png', id:'shopsign'},
			{src:'assets/item_display.png', id:'gameDisplay'},
			{src:'assets/item_display_star.png', id:'gameDisplayStar'},
			{src:'assets/item_angry.png', id:'itemAngry'},
			{src:'assets/item_expand.png', id:'itemExpand'},
			{src:'assets/button_buy.png', id:'buttonBuy'},
			{src:'assets/button_buy_disabled.png', id:'buttonBuyDisabled'},
			{src:'assets/button_arrow_left.png', id:'buttonArrowL'},
			{src:'assets/button_arrow_right.png', id:'buttonArrowR'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/item_restock.png', id:'itemRestock'},
			{src:'assets/item_result.png', id:'itemResult'},
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/item_star.png', id:'itemResultStar'},
			{src:'assets/item_star_disabled.png', id:'itemResultStarDisabled'},
			
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/item_pop.png', id:'itemPop'},
			{src:'assets/button_no.png', id:'buttonNo'},
			{src:'assets/button_yes.png', id:'buttonYes'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];
	
	for(n=0;n<instruction_arr.length;n++){
		manifest.push({src:instruction_arr[n], id:'welcome'+n});	
	}
	
	for(n=0;n<objects_arr.length;n++){
		manifest.push({src:objects_arr[n].src, id:objects_arr[n].id});	
	}
	
	for(n=0;n<people_arr.length;n++){
		manifest.push({src:people_arr[n].src, id:'people'+n});	
	}
	
	for(n=0;n<staff_arr.length;n++){
		manifest.push({src:staff_arr[n].src, id:'staff'+n});	
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/music_game.ogg', id:'musicGame'});
		manifest.push({src:'assets/sounds/music_main.ogg', id:'musicMain'});
		manifest.push({src:'assets/sounds/button.ogg', id:'soundButton'});
		manifest.push({src:'assets/sounds/pop.ogg', id:'soundPop'});
		manifest.push({src:'assets/sounds/cashregister.ogg', id:'soundCashRegister'});
		manifest.push({src:'assets/sounds/purchase.ogg', id:'soundPurchase'});
		manifest.push({src:'assets/sounds/result.ogg', id:'soundResult'});
		manifest.push({src:'assets/sounds/deliver.ogg', id:'soundDeliver'});
		manifest.push({src:'assets/sounds/take.ogg', id:'soundTake'});
		manifest.push({src:'assets/sounds/restock.ogg', id:'soundRestock'});
		manifest.push({src:'assets/sounds/lowstock.ogg', id:'soundLowstock'});
		manifest.push({src:'assets/sounds/tap.ogg', id:'soundTap'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}