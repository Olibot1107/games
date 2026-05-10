///
///	Nice & Smooth Loading Bar
///	https://snoutup.com
///

var loadingBarSpeed			= 0.05;
var loadingBarUpdateFreq	= 25;
var loadingEndDelay			= 1000;
var loadingFakePercentMax	= 100;

var loadingPercentTarget 	= loadingFakePercentMax;
var loadingPercent			= 0;

var canvas, bar, fill;
var isLoading	= false;

/// start loading
/// call this from your index.html in window.onload 
function loading_start() {
	canvas 	= document.getElementById("canvas");
	fill 	= document.getElementById("fill");
	bar  	= document.getElementById("bar");	
	
	canvas.style.display = "none";
	isLoading = true;
}

///	update loading bar width
function loading_bar_update(progress) {
	progress = Math.max(loadingPercent, progress);
	if (fill != undefined) {
		fill.style.width = progress + "%";
	}
}

/// set loading bar percentage
/// call this from your loading bar extension (LoadingBar_hook)
function loading_set_progress(progress) {
	loadingPercentTarget = Math.max(loadingPercentTarget, progress * 100);
	
	if (progress == 1) {
		setTimeout(function () {
			clearInterval(loadingFake);	
			bar.style.display = "none";		
			canvas.style.display = "block";
		}, loadingEndDelay);
	}
}

/// show fake loading bar before we get some progress
/// from GameMaker itself 

var loadingFake = setInterval(function() {
	if (isLoading) {
		loadingPercent = loading_lerp(loadingPercent, loadingPercentTarget, loadingBarSpeed);
		loading_bar_update(loadingPercent);
	}
}, loadingBarUpdateFreq);	


/// smooth things out 
function loading_lerp (start, end, amt){
	return (1 - amt) * start + amt * end;
}