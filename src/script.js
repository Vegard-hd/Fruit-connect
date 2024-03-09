console.log("test log");

const pear = `../assets/fruit-pear-pears-svgrepo-com.svg`;

const mango = `../assets/fruit-manga-mango-svgrepo-com.svg`;

const lemon = `../assets/fruit-limao-limon-svgrepo-com.svg`;

const orange = `../assets/fruit-laranja-orange-svgrepo-com.svg`;

const apple = `../assets/apple-apples-fruit-svgrepo-com.svg`;

const plum = `../assets/ameixa-fruit-plum-svgrepo-com.svg`;

function randomFruit() {
	let fruit;
	let rNum = Math.floor(Math.random() * 120);

	if (rNum <= 20) {
		fruit = pear;
	} else if (rNum <= 40) {
		fruit = mango;
	} else if (rNum <= 60) {
		fruit = lemon;
	} else if (rNum <= 80) {
		fruit = orange;
	} else {
		fruit = apple;
	}

	console.log(fruit);
	return fruit;
}

randomFruit();
