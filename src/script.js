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

//replaces "src" of each .SVG to a randomfruit
function replaceSrc(target = "#original") {
	$(target)
		.children()
		.each(function (indexInArray, valueOfElement) {
			// $(valueOfElement).attr("class");
			$(valueOfElement).attr("src", randomFruit);
		});
}
function createRow() {
	// Clones the original div, removes its ID attribute, and calls randomFruit() for each child.
	let divCopy = $("#original")
		.clone()
		.attr("id", "")
		.prependTo(".container-md")
		.toggleClass("d-none");

	replaceSrc(divCopy);
	// Apply a fade-in animation to the cloned row
	gsap.from(divCopy, {
		y: "-100%",
		opacity: 0,
		duration: 1,
		// ease: "bounce.in",
		ease: "power4.inOut",
	});

	//array that stores number of rows
	let arr1 = [];
	$("main div").each(function (index, element) {
		// element == this
		arr1.push(element);
	});
	if (arr1.length <= 8) createRow();
}
createRow();

function hoverStart() {
	$(this).css("width", "7rem");
}
function hoverEnd() {
	$(this).css("width", "6rem");
}
$("img").on("mouseenter", hoverStart).on("mouseleave", hoverEnd);
