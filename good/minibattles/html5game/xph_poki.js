/// Poki

function poki_test(msg) {
	// test callback by sending msg back to the game
	poki_log("poki_test(msg)");
	poki_callback(msg);
}

function poki_loading_finished() {
	poki_log("Loading finished");
	sdk.gameLoadingFinished();
}

function poki_loading_update(percents) {
	sdk.gameLoadingProgress({percentageDone: percents});
}

function poki_gameplay_start(reason) {
	poki_log("Gameplay Start: " + reason);
	sdk.gameplayStart();		
}

function poki_gameplay_stop(reason) {
	poki_log("Gameplay Stop: " + reason);
	sdk.gameplayStop();
}

function poki_happy(value) {
	poki_log("Happy: " + value);
	sdk.happyTime(value);
}

function poki_break(tag) {
	poki_callback("poki.break.started", tag);
	sdk.commercialBreak().then(function(){
		poki_callback("poki.break.completed", tag);
	});
}

function poki_rewarded_break(tag) {
	poki_callback("poki.rewarded.started", tag);
	sdk.rewardedBreak().then(
		(withReward) => {
			if (withReward) {
				poki_callback("poki.rewarded.completed", tag);
			} else {
				poki_callback("poki.rewarded.failed", tag);		
			}
		}
	);
}

/// this uses gmCallback extension to communicate with the game 
/// http://gmc.yoyogames.com/index.php?showtopic=549404

function poki_callback(event, args) {
	gmCallback.game_callback(event, args);	
}
