//new loading
	window.game = {}
	
	window.game.load_start = function(){
		window.game.loading_root = document.getElementById('loading_bg');
		window.game.loading_root.style.visibility = "visible";
		window.game.resize_game_canvas();
	}
	
	window.game.load_end = function(){
		window.game.loading_root.style.visibility = "hidden";
	}
	
	window.game.load_progress = function(progress){
		var progress_bar_text = document.getElementById('progress-bar-text');
			progress_bar_text.innerHTML  = "<b>" +  Math.ceil(progress*100) + "%</b>";

			var fg = document.getElementById('progress-bar-fg');

			console.log(fg.width);
			console.log("rect(0px,"  + fg.width * progress/1 + "px,"  + fg.height+"px," + "0px)" );
			fg.style.clip="rect(0px,"  + fg.width * progress/1 + "px,"  + fg.height+"px," + "0px)"

			if(isNaN(progress)){
				var progress_bar_root = document.getElementById('progress-bar-root');
				progress_bar_root.style.visibility = "hidden";
			}
	}

	function resize_game_canvas() {
		var progress_bar_root = document.getElementById('progress-bar-root');
		var progress_bar_fg = document.getElementById('progress-bar-fg');
		var progress_bar_bg = document.getElementById('progress-bar-bg');
		var progress_bar_text = document.getElementById('progress-bar-text');
		console.log("resize");
		if(progress_bar_root){
			console.log("resize in");
			var buttonHeight = 0;
		var innerWidth = window.innerWidth;
		var innerHeight = window.innerHeight - buttonHeight;
		console.log(innerWidth);
		console.log(innerHeight);
		var width = innerWidth;
		var height = innerHeight;
	
		var bar_h = width < height ? width:height;
		progress_bar_bg.width = Math.ceil(bar_h * 0.08 * 704.0/56) ;

		progress_bar_bg.style.marginLeft = - progress_bar_bg.width/2 + "px";
		progress_bar_fg.width =  Math.ceil(progress_bar_bg.width * 685/704);


		progress_bar_fg.style.marginTop = (progress_bar_bg.width * 56/704) * (1-39/56)/2 + "px";
		progress_bar_fg.style.marginLeft = -progress_bar_bg.width/2 - progress_bar_fg.width/2 + "px";

		progress_bar_text.style.fontSize = Math.ceil(bar_h * 0.10) + "px";
		progress_bar_root.style.bottom = Math.ceil(height*0.25 + buttonHeight) + "px";
		}
		
	}
	window.game.resize_game_canvas = resize_game_canvas;
	resize_game_canvas();
	window.addEventListener('resize', resize_game_canvas, false);
	window.addEventListener('orientationchange', resize_game_canvas, false);
