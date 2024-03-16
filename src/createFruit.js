export default class CreateFruit {
	constructor(whatFruit, rowNumber) {
		this.whatFruit = whatFruit;
		this.rowNumber = rowNumber;
		this.imgTarget = `#column-${this.rowNumber} img:first`;
		this.jqIdTarget = `#column-${this.rowNumber}`;
		this.target = $(this.imgTarget)
			.clone()
			.removeClass("d-none")
			.attr("src", this.whatFruit)
			.prependTo(this.jqIdTarget); // Use 'this.jqIdTarget'
		this.totalFruit;

		gsap.fromTo(
			this.target,
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
}
