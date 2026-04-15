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
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkMobileOrientation, 1000);
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/background_p.png', id:'backgroundP'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_start.png', id:'buttonStart'},

			{src:'assets/item_status.png', id:'itemStatus'},
			{src:'assets/button_arrow.png', id:'buttonArrow'},
			{src:'assets/item_level.png', id:'itemLevel'},
			{src:'assets/item_level_lock.png', id:'itemLevelLock'},
			{src:'assets/button_retry.png', id:'buttonRetry'},
			{src:'assets/button_retry.png', id:'buttonBack'},
		
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/item_result.png', id:'itemResult'},
			{src:'assets/item_result_p.png', id:'itemResultP'},
			{src:'assets/item_exit.png', id:'itemExit'},
			{src:'assets/item_exit_p.png', id:'itemExitP'},
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];

	for(var n=0; n<themeSettings.length; n++){
		for(var c=0; c<themeSettings[n].colors.length; c++){
			manifest.push({src:themeSettings[n].colors[c].src, id:'puzzleColor'+n+'_'+c});
		}
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
		manifest.push({src:'assets/sounds/sound_click.ogg', id:'soundButton'});
		manifest.push({src:'assets/sounds/sound_start.ogg', id:'soundStart'});
		manifest.push({src:'assets/sounds/sound_result.ogg', id:'soundResult'});
		manifest.push({src:'assets/sounds/sound_complete.ogg', id:'soundComplete'});
		manifest.push({src:'assets/sounds/sound_connect.ogg', id:'soundConnect'});
		manifest.push({src:'assets/sounds/sound_error.ogg', id:'soundError'});
		manifest.push({src:'assets/sounds/sound_select.ogg', id:'soundSelect'});
		manifest.push({src:'assets/sounds/sound_reset.ogg', id:'soundReset'});
		manifest.push({src:'assets/sounds/sound_unlock.ogg', id:'soundUnlock'});
		manifest.push({src:'assets/sounds/music_main.ogg', id:'musicMain'});
		manifest.push({src:'assets/sounds/music_game.ogg', id:'musicGame'});
		
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