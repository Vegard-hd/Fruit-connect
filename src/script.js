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
let pearCount = 0;
let mangoCount = 0;
let lemonCount = 0;
let orangeCount = 0;
let appleCount = 0;
let plumCount = 0;
var totalFruit = 0;
function fruitCounter(target = "") {
	if ($(target).attr("src") === pear) pearCount += 1;
	else if ($(target).attr("src") === mango) mangoCount += 1;
	else if ($(target).attr("src") === lemon) lemonCount += 1;
	else if ($(target).attr("src") === orange) orangeCount += 1;
	else if ($(target).attr("src") === apple) appleCount += 1;
	else if ($(target).attr("src") === plum) plumCount += 1;
	totalFruit =
		pearCount + mangoCount + lemonCount + orangeCount + appleCount + plumCount;
	console.log(
		pearCount + mangoCount + lemonCount + orangeCount + appleCount + plumCount
	);
	return totalFruit;
}

function fruitDelete(target = "") {
	if ($(target).attr("src") === pear) pearCount -= 1;
	else if ($(target).attr("src") === mango) mangoCount -= 1;
	else if ($(target).attr("src") === lemon) lemonCount -= 1;
	else if ($(target).attr("src") === orange) orangeCount -= 1;
	else if ($(target).attr("src") === apple) appleCount -= 1;
	else if ($(target).attr("src") === plum) plumCount -= 1;
	totalFruit =
		pearCount + mangoCount + lemonCount + orangeCount + appleCount + plumCount;
	console.log(
		pearCount + mangoCount + lemonCount + orangeCount + appleCount + plumCount
	);
	return totalFruit;
}

function createRandomFruit() {
	let imgCopy = $("img:first")
		.clone()
		.removeClass("d-none")
		.attr("src", randomFruit)
		.prependTo("#original");
	fruitCounter("img:first");
	popAnimation(imgCopy);
}
function popAnimation(target) {
	gsap.fromTo(
		target,
		{
			scale: 0, // Start with 0 scale (hidden)
			opacity: 0, // Start with 0 opacity
		},
		{
			scale: 1, // Pop to full size
			opacity: 1, // Fade in
			duration: 0.04,
			ease: "elastic.out(1, 0.3)",
			onComplete: function () {
				if (totalFruit < 78) createRandomFruit();
				else {
					eventListeners();
				}
			},
		}
	);
}
function imgHover() {
	//create a timeline
	let tl = gsap.timeline();
	tl.fromTo(
		this,
		{
			rotation: 0,
		},
		{
			scale: 1.2,
			duration: 0.2,
			rotation: 60,
			yoyo: true,
		}
	);
	tl.to(this, { rotation: -60, duration: 0.15 });
	tl.to(this, {
		rotation: 0,
		scale: 1,
		duration: 0.15,
	});
}

function imgClick() {
	const removeElement = () => {
		fruitDelete(this);
		if (totalFruit < 78) createRandomFruit();
		return $(this).remove();
	};
	let tl = gsap.timeline();
	let tl2 = gsap.timeline();
	let randomX = Math.floor(Math.random() * 1000);
	tl.to(this, { y: -300, x: randomX, scale: 3, duration: 3 });
	tl2.to(this, { rotation: -360, duration: 0.15 });
	tl2.to(this, {
		rotation: 360,
		duration: 1,
	});
	tl2.to(this, {
		opacity: 0,
		duration: 1,
		onComplete: removeElement,
	});
}

$(".btn").on("click", function () {
	if (totalFruit < 78) createRandomFruit();
});
function eventListeners() {
	$("img").on("mouseover", imgHover);
	$("img").on("click", imgClick);
}
//make just one big flexbox of fruits

// let pearCount = 0;
// let mangoCount = 0;
// let lemonCount = 0;
// let orangeCount = 0;
// let appleCount = 0;
// let plumCount = 0;
