export default class CreateFruit {
	constructor(whatFruit, rowNumber) {
		this.whatFruit = whatFruit;
		this.rowNumber = rowNumber;
		this.imgTarget = `#column-${this.rowNumber} img:first`;
		this.jqIdTarget = `#column-${this.rowNumber}`;
		this.fruitClass = `Insidecolumn-${rowNumber}`;
		this.totalFruit;
		this.fruitsInColumn;
		this.target = $(this.imgTarget);
		let copy = $(this.target)
			.clone()
			.removeClass("d-none")
			.addClass(this.fruitClass)
			.attr("src", this.whatFruit)
			.prependTo(this.jqIdTarget);
		gsap.fromTo(
			copy,
			{
				scale: 0, // Start with 0 scale (hidden)
				opacity: 0, // Start with 0 opacity
			},
			{
				scale: 1, // Pop to full size
				opacity: 1, // Fade in
				duration: 1.5,
				ease: "elastic.out(1, 0.3)",
			}
		);
	}

	static fruitCount() {
		this.totalFruit = $("img").length;
		console.log(this.totalFruit);
		return this.totalFruit;
	}
	static countFruitsInColumn(targetColumn = 1) {
		let selector = `#column-${targetColumn} img`;
		return (this.fruitsInColumn = $(selector).length);
	}
}
