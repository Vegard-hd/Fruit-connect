export default class CreateFruitRow {
	rowNumber;
	fruitInRow;
	totalFruit;
	fruit;
	constructor(rowNumber) {
		this.rowNumber = rowNumber;
		this.fruitInRow = 0;
		this.totalFruit = 0;
		this.fruit = fruit;
	}
	Start() {
		const jqIdTarget = `#column-${this.rowNumber}`;
		while (!(this.fruitInRow >= 7)) {
			setTimeout(() => {}, 250);
			$(jqIdTarget)
				.clone()
				.removeClass("d-none")
				.attr("src", this.randomFruit())
				.prependTo(jqIdTarget);
			console.log("Fruit created");
			this.fruitInRow = $(`${jqIdTarget} img`).length;
			this.totalFruit = $("img").length;

			gsap.fromTo(
				jqIdTarget,
				{
					scale: 0, // Start with 0 scale (hidden)
					opacity: 0, // Start with 0 opacity
				},
				{
					scale: 1, // Pop to full size
					opacity: 1, // Fade in
					duration: 1.5,
					ease: "elastic.out(1, 0.3)",
					// onComplete: () => this.Start,
					// onComplete: this.Start.bind(this),
				}
			);
		}
	}
}
