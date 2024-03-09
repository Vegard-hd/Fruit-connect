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

// replaces img link in original with random fruits
$("#original")
	.children()
	.each(function (indexInArray, valueOfElement) {
		// $(valueOfElement).attr("class");
		$(valueOfElement).attr("src", randomFruit);
	});

function createRow() {
	// Clones the original div, removes its ID attribute, and calls randomFruit() for each child.
	let divCopy = $("#original")
		.clone()
		.attr("id", "")
		.prependTo(".container-md");

	// Apply a fade-in animation to the cloned row
	gsap.from(divCopy, {
		y: "-100%",
		opacity: 0,
		duration: 1,
		ease: "expo.in",
	});

	$(divCopy)
		.children()
		.each(function (indexInArray, valueOfElement) {
			$(valueOfElement).attr("src", randomFruit);
		});
	let arr1 = [];
	$("main div").each(function (index, element) {
		// element == this
		arr1.push(element);
	});
	console.log(arr1);
	// if (arr1.length <= 8) createRow();
}
createRow();

// Example usage:

// gsap.
