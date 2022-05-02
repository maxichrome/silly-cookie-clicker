const GAME_TICK_INTERVAL = 500;
const COOKIE_STYLES = {
	snickerdoodle: "cookie_snickerdoodle.png",
	red_velvet: "cookie_red.png",
};

let isPlaying = true;
let score = 0;
let clickMultiplier = 1;

const cookieButton = document.getElementById("cookie");
const cookieImage = document.getElementById("cookieImage");
const cookieStyleList = document.getElementById("cookieStyleList");

function updateScore(amount = 1, multiplier = clickMultiplier, set = false) {
	const adjustmentAmount = amount * multiplier;

	if (set) score = adjustmentAmount;
	else score += adjustmentAmount;

	document.getElementById("score").innerHTML = score;
}

function setCookieStyle(styleName = "snickerdoodle") {
	const filename = COOKIE_STYLES[styleName];

	localStorage.setItem("cookieStyle", styleName);
	cookieImage.src = `/img/${filename}`;
}

function clickCookie() {
	if (!isPlaying) return;

	updateScore();
}

// function doGameTick() {
// }

// let gameTickInterval = setInterval(doGameTick, GAME_TICK_INTERVAL);

function freeze() {
	isPlaying = false;

	// clearInterval(gameTickInterval);

	cookieButton.disabled = true;
}

function unfreeze() {
	isPlaying = true;

	// gameTickInterval = setInterval(doGameTick, GAME_TICK_INTERVAL);

	cookieButton.disabled = false;
}

Object.entries(COOKIE_STYLES).forEach(([style, filename]) => {
	const li = document.createElement("li");
	const btn = document.createElement("button");
	const img = document.createElement("img");

	const friendlyStyleName = style.replace("_", " ");

	img.width = 50;
	img.height = 50;
	img.src = `/img/${filename}`;
	img.alt = friendlyStyleName;

	btn.ariaLabel = friendlyStyleName;
	btn.onclick = () => {
		setCookieStyle(style);
	};

	btn.appendChild(img);
	li.appendChild(btn);

	cookieStyleList.appendChild(li);
});

function saveGameState() {
	localStorage.setItem("score", score);
}

function loadGameState() {
	updateScore(+localStorage.getItem("score"), 1, true);

	const storedCookieStyle = localStorage.getItem("cookieStyle");
	setCookieStyle(storedCookieStyle || "snickerdoodle");
}

loadGameState();

setInterval(saveGameState, 500);
