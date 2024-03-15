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
/// TODO- make each row vertical and independent

let totalFruit = 0;
function createRandomFruit() {
	$("img:first")
		.clone()
		.removeClass("d-none")
		.attr("src", randomFruit)
		.prependTo("#column-1");
	totalFruit = $("img").length - 1;
	if (totalFruit <= 77) {
		// popAnimation(imgCopy);
	} else {
		eventListeners();
	}
}
function removeFruit() {
	$(this).remove();
	console.log("removed fruit");
	totalFruit = $("img").length - 1;
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
				createRandomFruit();
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
	$(this).addClass("unclickable-element");
	// removeFruit(this);
	let tl = gsap.timeline();
	let tl2 = gsap.timeline();
	let tl3 = gsap.timeline();
	let randomX = Math.floor(Math.random() * 1000);
	tl.to(this, {
		y: -300,
		x: randomX,
		scale: 3,
		duration: 3,
		onComplete: () => {
			$(this).remove();
			console.log("removed fruit");
			totalFruit = $("img").length - 1;
		},
	});
	tl2.to(this, { rotation: -360, duration: 0.15 });
	tl2.to(this, {
		rotation: 360,
		duration: 1,
	});
	tl3.to(this, {
		scale: 2,
		duration: 0.2,
		ease: "elastic.in(1,0.3)",
	});
	tl3.to(this, {
		scale: 0,
		opacity: 0,
		duration: 1,
		ease: "elastic.in(1,0.3)",
	});
}

$(".btn").on("click", function () {
	createRandomFruit();
});
function eventListeners() {
	$("img").on("mouseover", imgHover);
	$("img").on("click", imgClick);
}
