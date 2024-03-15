export default class CreateFruit {
	constructor(whatFruit, rowNumber) {
		this.whatFruit = whatFruit;
		this.rowNumber = rowNumber;
		this.jqIdTarget = `#column-${this.rowNumber}`;
		this.target = $(this.jqIdTarget) // Use 'this.jqIdTarget'
			.clone()
			.removeClass("d-none")
			.attr("src", this.whatFruit)
			.prependTo(this.jqIdTarget); // Use 'this.jqIdTarget'
		this.totalFruit = $("img").length;
	}
}
