export default class CreateFruitRow {
	constructor(rownumber = Number) {
		this.rownumber = rownumber;
	}
	fruitInRow = 0;
	totalFruit = 0;
	Start() {
		columns = `#column-${rownumber}`;
		if (fruitInRow >= 7) {
			console.log("Row complete");
		} else {
			let imgCopy = $(".col-1 img:first")
				.clone()
				.removeClass("d-none")
				.attr("src", randomFruit)
				.prependTo(columns);
			fruitInRow = $(`${columns} img`).length;
			totalFruit = $("img").length;
			this.popAnimation(imgCopy);
		}
	}
	popAnimation(target) {
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
					this.Start();
				},
			}
		);
	}
}
