



addMainPageGames();



function isEmpty(value) {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}

function addMainPageGames()
{
	//document.addEventListener('DOMContentLoaded', function() {
		
		addRecentGames();
		
		addArrowListeners();
		//findLazyImages();
	//});
	
	
}

function addRecentGames()
{
	let recentGamesDiv = document.getElementById('recentGamesHorizontalCon');
		
	let gamesConDiv = document.createElement('div');
	gamesConDiv.className = 'gamesCon';
		
	recentGamesDiv.appendChild(gamesConDiv);

	var postData = JSON.parse(localStorage.getItem('postData'));
	if (postData != null && postData.length > 0)
	{
		let recentGamesLabel = document.getElementById('recentGamesLabel'); 
		recentGamesLabel.style.display = '';
		recentGamesLabel.style.paddingLeft = '4%';
		
		const childArrowRightCon = recentGamesDiv.querySelector('.arrowCon.arrowRightCon');
		if (childArrowRightCon) {
			childArrowRightCon.style.visibility = 'visible';
		}
			
		console.log("recent games: " + postData.length);
		// Loop through the post data and create elements for each post
		postData.forEach(function(post) {
    		if (isEmpty(post.title) == false && isEmpty(post.featuredImage) == false && isEmpty(post.url) == false
				&& gamesConDiv.childElementCount < 12)
			{
				gamesConDiv.appendChild(createGameButton(post, '', false));
			}
		});
	}
		
}

async function addArrowListeners() {
    const leftArrows = document.getElementsByClassName('arrowLeftCon');
    const rightArrows = document.getElementsByClassName('arrowRightCon');

    for (let arrow of leftArrows) {
        arrow.addEventListener('click', (e) => {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelectorAll('.gamesCon')[0];

            gamesCon.scrollLeft -= Math.min(gamesCon.scrollLeft, 1100);
        });
    }

    for (let arrow of rightArrows) {
        arrow.addEventListener('click', (e) => {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelectorAll('.gamesCon')[0];

            const leftArrow = e.target.parentNode.parentNode.querySelectorAll('.arrowCon')[0];
            leftArrow.style.visibility = 'visible';

            const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
            gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
        });
    }
}


function modifyImageUrl (imageUrl) {
	let parts = imageUrl.split('/');
		
	let imageFilename = parts.pop();
		
	parts.push('responsive');
	parts.push(imageFilename);
		
	let responsiveImagePath = parts.join('/');
		
	responsiveImagePath = responsiveImagePath.replace(/(\.[\w\d_-]+)$/i, '-xs$1');
		
	return responsiveImagePath;
}

function createGameButton(game, pin, lazy) {
	
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7 * 3);


    //const onclick = `location.href = 'class.html?class=${game.replaceAll(' ', '-')}'`;
	let gameName = game.title;
	//const onclick = `location.href = 'class.html?class=${gameName.replaceAll(' ', '-')}'`;
    let onclick = `location.href = '${game.url}'`;



    let gameDiv = document.createElement('div');
    gameDiv.setAttribute('tagName', gameName);
    gameDiv.id = 'gameDiv';
	//gameDiv.classlist = formatTags(data.tags);
    gameDiv.setAttribute('onclick', onclick);

    if (pin == 'pin') {
        let button = document.createElement('button');
        button.id = 'pin';

        let image = document.createElement('img');
        image.src = '/assets/images/icons/coloredpin.avif';

        button.appendChild(image);

        gameDiv.appendChild(button);
    } else if (pin == 'hot') {
        let button = document.createElement('button');
        button.id = 'newbanner';

        let image = document.createElement('img');
        image.src = 'assets/images/icons/hotbanner.avif';

        button.appendChild(image);

        gameDiv.appendChild(button);
    } else if (pin == 'hidden') {
        gameDiv.style.display = 'none';
    } else if (pin != 'suggested') {
        gameDiv.classList.add('all');
    }


    /*if (gameDate > weekAgo) {
        gameDiv.classList.add('new');

        let button = document.createElement('button');
        button.id = 'newbanner';

        let image = document.createElement('img');
        image.src = 'assets/images/icons/newbanner.avif';

        button.appendChild(image);

        gameDiv.appendChild(button);
    }*/


    let imageContainer = document.createElement('div');
    imageContainer.className = 'imageCon';

    let img = document.createElement('img');
    img.setAttribute('data-src', game.featuredImage);
    img.src = modifyImageUrl(game.featuredImage);
    img.alt = `FreezeNova ${gameName}`;
    img.title = `FreezeNova ${gameName}`;
    img.className = '';
	img.setAttribute('loading', 'lazy');

    imageContainer.appendChild(img);

    gameDiv.appendChild(imageContainer);

    let header = document.createElement('h3');
    header.className = 'innerGameDiv';
    header.innerText = gameName;

    gameDiv.appendChild(header);

    return gameDiv;
}

async function findLazyImages() {
    // Get all the lazy images
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.classList.remove('lazy');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Start loading the images when they are 10% visible
            threshold: 0.1,

            // Start loading the images when they are 500 pixels away from the viewport
            rootMargin: '500px 0px',
        }
    );

    lazyImages.forEach((image) => {
        observer.observe(image);
    });
}