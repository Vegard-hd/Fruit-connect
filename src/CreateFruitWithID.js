import CreateFruit from "./createFruit.js";
export default class CreateFruitWithID extends CreateFruit {
	constructor(whatfruit, rownumber, id) {
		super(whatfruit, rownumber);
		this.id = id;
	}
	cloneFruit() {
		this.imgTarget = `#column-${this.rowNumber} img:first`;
		this.jqIdTarget = `#column-${this.rowNumber}`;
		$(this.target)
			.clone()
			.removeClass("d-none")
			.attr("src", this.whatFruit)
			.attr("id", this.id)
			.prependTo(this.jqIdTarget);
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
}
