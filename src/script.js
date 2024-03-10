const pear = `../assets/fruit-pear-pears-svgrepo-com.svg`;
const mango = `../assets/fruit-manga-mango-svgrepo-com.svg`;
const lemon = `../assets/fruit-limao-limon-svgrepo-com.svg`;
const orange = `../assets/fruit-laranja-orange-svgrepo-com.svg`;
const apple = `../assets/apple-apples-fruit-svgrepo-com.svg`;
const plum = `../assets/ameixa-fruit-plum-svgrepo-com.svg`;
$(function () {
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
	var fruitCount = [];
	function fruitCounter(target = "") {
		if ($(target).attr("src") === pear) fruitCount.push("pear");
		else if ($(target).attr("src") === mango) fruitCount.push("mango");
		else if ($(target).attr("src") === lemon) fruitCount.push("lemon");
		else if ($(target).attr("src") === orange) fruitCount.push("orange");
		else if ($(target).attr("src") === apple) fruitCount.push("apple");
		else if ($(target).attr("src") === plum) fruitCount.push("plum");
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
					if (fruitCount.length < 78) createRandomFruit();
					else {
						eventListeners();
					}
				},
			}
		);
	}
	function imgHover() {
		//create a timeline
		console.log("hover called");
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
		tl.to(this, { rotation: 0, scale: 1, duration: 0.15 });
	}

	function imgClick() {
		gsap.to(this, {
			duration: 1,
			rotation: 360,
			// yoyo: true,
		});
	}
	$(".btn").on("click", function () {
		if (fruitCount.length < 78) createRandomFruit();
	});
	function eventListeners() {
		$("img").on("mouseover", imgHover).on("click", imgClick);
	}
	//make just one big flexbox of fruits
});
