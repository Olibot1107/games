////////////////////////////////////////////////////////////
// MOBILE
////////////////////////////////////////////////////////////
var resizeTimer;

/*!
 * 
 * START MOBILE CHECK - This is the function that runs for mobile event
 * 
 */
function checkMobileEvent(){
	if($.browser.mobile || isTablet){
		$( window ).off('orientationchange').on( "orientationchange", function( event ) {
			$('#canvasHolder').hide();
			$('#rotateHolder').hide();
			
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(checkMobileOrientation, 1000);
		});
		
		checkMobileOrientation();
	}
}

/*!
 * 
 * MOBILE ORIENTATION CHECK - This is the function that runs to check mobile orientation
 * 
 */
function checkMobileOrientation() {
	var isLandscape=false;
	
	if(window.innerWidth>window.innerHeight){
		isLandscape=true;
	}
	
	if($.editor.enable){
		viewport.isLandscape = edit.isLandscape;
	}else{
		viewport.isLandscape = isLandscape;	
	}
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
	$('#canvasHolder').show();
}

/*!
 * 
 * TOGGLE ROTATE MESSAGE - This is the function that runs to display/hide rotate instruction
 * 
 */
function toggleRotate(con){
	if(con){
		$('#rotateHolder').fadeIn();
	}else{
		$('#rotateHolder').fadeOut();		
	}
	resizeGameFunc();
}