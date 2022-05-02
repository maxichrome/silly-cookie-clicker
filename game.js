const GAME_TICK_INTERVAL = 500;
const COOKIE_STYLES = {
	snickerdoodle: "cookie_snickerdoodle.png",
	red_velvet: "cookie_red.png",
};

const buyables = {
	autoClicker: {
		price: 100,
		clickProducer: {
			clickMultiplier: 1,
			clickInterval: 1000,
		},
	},
	multiplier: {
		price: 200,
		userMultiplier: 1,
	},
};

const clickProducers = {
	user: {
		clickMultiplier: 1,
		clickInterval: null,
	},
};

let isPlaying = true;
let score = 0;

const cookieButton = document.getElementById("cookie");
const cookieImage = document.getElementById("cookieImage");
const cookieStyleList = document.getElementById("cookieStyleList");

function updateScore(amount = 1, multiplier = 1, set = false) {
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

function produceClick(producer = clickProducers.user) {
	if (!isPlaying) return;

	updateScore(1, producer.clickMultiplier);
}

function purchase(buyableName = "autoClicker") {
	const buyable = buyables[buyableName];
	const { price } = buyable;

	if (price > score) return false;

	updateScore(-price);

	if (buyable.clickProducer) {
		addClickProducer(buyableName, buyable.clickProducer);
	}
	if (buyable.userMultiplier) {
		clickProducers.user.clickMultiplier += buyable.userMultiplier;
	}
}

function addClickProducer(producerName, producer, delay = 0) {
	if (clickProducers[producerName] && producerName !== "user") {
		producerName += "_" + (Object.keys(clickProducers).length + 1);
	}

	clickProducers[producerName] = producer;

	if (producer.clickInterval) {
		setTimeout(() => {
			clickProducers[producerName].clickIntervalId = setInterval(
				() => produceClick(producer),
				producer.clickInterval
			);
		}, delay);
	}
}

function removeClickProducer(producerName) {
	const producer = clickProducers[producerName];

	if (producer.clickIntervalId) {
		clearInterval(producer.clickIntervalId);
	}
}

function freeze() {
	isPlaying = false;

	cookieButton.disabled = true;
}

function unfreeze() {
	isPlaying = true;

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
	localStorage.setItem("clickProducers", JSON.stringify(clickProducers));
}

function loadGameState() {
	updateScore(+localStorage.getItem("score"), 1, true);

	try {
		const storedProducers = JSON.parse(
			localStorage.getItem("clickProducers") || "{}"
		);
		Object.entries(storedProducers).forEach(
			([producerName, producer], i, { length }) => {
				addClickProducer(producerName, producer, ((i / length) * 1000) % 1000);
			}
		);
	} catch {}

	const storedCookieStyle = localStorage.getItem("cookieStyle");
	setCookieStyle(storedCookieStyle || "snickerdoodle");
}

loadGameState();
console.table(clickProducers);

setInterval(saveGameState, 500);
