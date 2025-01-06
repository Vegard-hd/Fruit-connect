export default function randomFruit() {
	const pear = `../assets/fruit-pear-pears-svgrepo-com.svg`;
	const mango = `../assets/fruit-manga-mango-svgrepo-com.svg`;
	const lemon = `../assets/fruit-limao-limon-svgrepo-com.svg`;
	const orange = `../assets/fruit-laranja-orange-svgrepo-com.svg`;
	const apple = `../assets/apple-apples-fruit-svgrepo-com.svg`;
	const plum = `../assets/ameixa-fruit-plum-svgrepo-com.svg`;
	let fruit;
	let fruitType;
	let rNum = Math.floor(Math.random() * 6 + 1);

	switch (rNum) {
		case 1:
			fruit = pear;
			fruitType = "pear";
			break;
		case 2:
			fruit = mango;
			fruitType = "mango";
			break;
		case 3:
			fruit = lemon;
			fruitType = "lemon";
			break;
		case 4:
			fruit = orange;
			fruitType = "orange";
			break;
		case 5:
			fruit = apple;
			fruitType = "apple";
			break;
		case 6:
			fruit = plum;
			fruitType = "plum";
			break;
	}
	return `<img src="${fruit}" alt="${fruitType}" />`;
}
