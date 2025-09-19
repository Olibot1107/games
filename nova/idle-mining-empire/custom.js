// wg universal
!function(e,t){a=e.createElement("script"),m=e.getElementsByTagName("script")[0],a.async=1,a.src=t,m.parentNode.insertBefore(a,m)}(document,"https://universal.wgplayer.com/tag/?lh="+window.location.hostname+"&wp="+window.location.pathname+"&ws="+window.location.search);

function InitApi()
{
	var dateNow = new Date();
	var secondsSinceEpoch = Math.round(dateNow.getTime() / 1000);
		
	console.log('InitApi');
			
	window.callTime = secondsSinceEpoch - 361;
}

function ExternEval()
{
	console.log("ExternEval");
			
	var dateNow = new Date();
	var secondsSinceEpoch = Math.round(dateNow.getTime() / 1000);
			
	if (window.callTime != undefined && 
		secondsSinceEpoch - window.callTime > 360)
	{
		console.log('ExternEval 2');
				
		window.callTime = secondsSinceEpoch;
				
		if (typeof preroll !== 'undefined')
		{
			if (window[preroll.config.loaderObjectName] != undefined)
			{
				//gameInstance.SendMessage('FreezeNovaAPI', 'AdMessage', 'onOpen');
				PAUSE();
					
				try {
					window[preroll.config.loaderObjectName].refetchAd(ExternEvalResumeGame);
				}
				catch(err) {
					console.log(err.message);
					//gameInstance.SendMessage('FreezeNovaAPI', 'AdMessage', 'onClose');
					RESUME();
				}
			}
		}
	}
			
}
		
function ExternEvalResumeGame()
{
	console.log("ExternEvalResumeGame");
		
	//gameInstance.SendMessage('FreezeNovaAPI', 'AdMessage', 'onClose');
	RESUME();
}


function _GAME_LOADED() {
  //INJECT YOUR OWN CODE HERE
  console.log("GAME LOADED");
}

function _START_GAME() {
  //INJECT YOUR OWN CODE HERE
  console.log("START GAME");
  
  ExternEval();
}

function _END_GAME() {
  //INJECT YOUR OWN CODE HERE
  console.log("END GAME");
}

InitApi();