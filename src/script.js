console.log("test log");

const pear = `../assets/fruit-pear-pears-svgrepo-com.svg`;

const mango = `../assets/fruit-manga-mango-svgrepo-com.svg`;

const lemon = `../assets/fruit-limao-limon-svgrepo-com.svg`;

const orange = `../assets/fruit-laranja-orange-svgrepo-com.svg`;

const apple = `../assets/apple-apples-fruit-svgrepo-com.svg`;

const plum = `../assets/ameixa-fruit-plum-svgrepo-com.svg`;

function randomFruit() {
	let fruit;
	let rNum = Math.floor(Math.random() * 6 + 1);

	switch (rNum) {
		case 1:
			fruit = pear;
			break;
		case 2:
			fruit = mango;
			break;
		case 3:
			fruit = lemon;
			break;
		case 4:
			fruit = orange;
			break;
		case 5:
			fruit = apple;
			break;
		case 6:
			fruit = plum;
			break;
	}
	return fruit;
}

randomFruit();
// replaces img link in original with random fruits
$("#original")
	.children()
	.each(function (indexInArray, valueOfElement) {
		$(valueOfElement).attr("src", randomFruit);
	});
function creatRow() {
	$("#original")
		.clone()
		.children()
		.each(function (indexInArray, valueOfElement) {
			$(valueOfElement).attr("src", randomFruit);
		})
		.appendTo(".main");
}

creatRow();
creatRow();
