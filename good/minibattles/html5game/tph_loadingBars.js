/***************************************

	JCHTML5 Loading Bars
	http://www.juicycraft.com/jchtml5
	Follow me! @SamWhillance

***************************************/

// The colours of the loading screen
// Get your HEX colours at http://www.colorpicker.com
var colourBackground = "#242424";	//"#3796E3";			//This is your base colour (Change this)
var colourText = shadeColor(colourBackground,70);			//This is calculated from your base colour (but can be a custom HEX)
var colourLoadingBack = shadeColor(colourBackground,-10);	//This is calculated from your base colour (but can be a custom HEX)
var colourLoadingFront = shadeColor(colourBackground,70);	//This is calculated from your base colour (but can be a custom HEX)

// If 'loading_bar_smoother' is not defined, define it
if (typeof loading_bar_smoother === 'undefined') {
    var loading_bar_smoother = 0;
}

// Your Own Custom Loading Bar (Copy code from the loading bars below to make your own)
function jchtml5_custom_loading_bar(_graphics, _width, _height, _total, _current, _loadingscreen){
	_width = window.innerWidth;
	_height = window.innerHeight;
	_canvas = document.getElementById("canvas");

	//Add your own stuff here (from the other loading bars)
}

// Full screen Loading Bar (WebGL OFF)
function jchtml5_fullscreen_loading_bar(_graphics, _width, _height, _total, _current, _loadingscreen){
	// Make the loading bar image visible
	var element = document.getElementById('loading_image_div');

	if (element != null) {
		element.style.display = 'block';
	}

	_width = window.innerWidth;
	_height = window.innerHeight;
	_canvas = document.getElementById("canvas");

	_graphics.clearRect ( 0 , 0 , _width , _height );

	if (_canvas.width !== _width || _canvas.height !== _height)
	{
		// Set the canvas size
		_canvas.width = _width;
		_canvas.height = _height;

		// Fill entire screen with colour
		_graphics.fillStyle = colourBackground;
		_graphics.fillRect(0, 0, _width, _height);
	}

	var _g = _graphics;
	_graphics = _canvas.getContext("2d");
	if (_graphics == null)_graphics = _g;

	// Fill entire screen with colour
	_graphics.fillStyle = colourBackground;
	_graphics.fillRect(0, 0, _width, _height);

	// Calculate loading bar position and size
	var barW = Math.round(_width / 4);
	var barH = Math.max(Math.round(_height / 40), 4);
	var barX = Math.round((_width - barW) / 2);
	var barY = Math.round((_height - barH) / 1.75);

	// Draw the loading bar (full)
	_graphics.fillStyle = colourLoadingBack;
	_graphics.fillRect(barX, barY, barW, barH);

	// Work out the completion status
	var fillW = Math.round((barW / _total) * _current);

	//Make the loading bar smooth
	if (loading_bar_smoother < fillW){
		loading_bar_smoother += 4;
	}

	// Draw the loading bar (current) if something has loaded
	if (_current !== 0){
		_graphics.fillStyle = colourLoadingFront;
		_graphics.fillRect(barX, barY, loading_bar_smoother, barH);
	}
}

// Loading Bar (WebGL ON)
function jchtml5_webgl_loading_bar(_graphics, _width, _height, _total, _current, _loadingscreen){
	_canvas = document.getElementById("canvas");
	_width = _canvas.width;
	_height = _canvas.height;

	_graphics.clearRect ( 0 , 0 , _width , _height );

	// Fill canvas with colour
	_graphics.fillStyle = colourBackground;
	_graphics.fillRect(0, 0, _width, _height);

	if (_current == 0){
		_graphics.font = "20px Arial";
		_graphics.fillStyle = colourText;
		_graphics.textAlign ="center";
		_graphics.fillText("Loading",_width / 2,(_height / 2) - 30);
	}

	// Calculate loading bar position and size
	var barW = Math.round(_width / 4);
	var barH = Math.max(Math.round(_height / 40), 4);
	var barX = Math.round((_width - barW) / 2);
	var barY = Math.round((_height - barH) / 2);

	// Draw the loading bar (full)
	_graphics.fillStyle = colourLoadingBack;
	_graphics.fillRect(barX, barY, barW, barH);

	// Work out the completion status
	var fillW = Math.round((barW / _total) * _current);

	if (loading_bar_smoother < fillW){
		loading_bar_smoother += 4;
	}

	// Draw the loading bar (current) if something has loaded
	if (_current !== 0){
		_graphics.fillStyle = colourLoadingFront;
		_graphics.fillRect(barX, barY, loading_bar_smoother, barH);
		
		_graphics.font = "20px Arial";
		_graphics.textAlign="center";
		_graphics.fillText("Loading",_width / 2,(_height / 2) - 30);
	}
}

//Shade a colour given to me
function shadeColor(color, percent) {  
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// Hide the loading bar image (called when the game has finished loading)
function jchtml5_hide_loading_image() {
	
	//Hide the loading image
	var element = document.getElementById('loading_image_div');
	if (element != null) {
		element.style.display = 'none';
	}

	//Hide the canvas
	var _canvas = document.getElementById("gm4html5_div_id");
	if (_canvas != null) {
		_canvas.style.display = 'none';
	}
}

function jchtml5_show_canvas() {
	//Show the canvas
	var _canvas = document.getElementById("gm4html5_div_id");
	if (_canvas != null) {
		_canvas.style.display = 'block';
	}
}