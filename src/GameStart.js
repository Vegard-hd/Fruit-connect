import randomFruit from "./RandomFruit.js";
function CreateImg() {
	const img = document.createElement("img");
	// Set initial properties (0 opacity and 0 scale)
	gsap.set($(img), { opacity: 0, scale: 0 });

	// Create the pop animation
	gsap.to($(img), {
		duration: 0.5,
		opacity: 1,
		scale: 1,
		ease: "back.out(2)", // Adjust easing as desired
	});
	return $(img)
		.addClass("col")
		.attr("src", randomFruit())
		.attr("alt", "a fruit");
}
async function GameStart() {
	function CreateColumn(columnNumber) {
		const div = document.createElement("div");
		const divClass = `column-${columnNumber}`;
		const parent = $(div)
			.addClass("col-1")
			.attr("id", divClass)
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`))
			.prepend(CreateImg().addClass(`inside-col-${columnNumber}`));
		return $(".row").prepend(parent);
	}
	function recursiveColum(columnsToCreate) {
		if (columnsToCreate <= 0) return;
		CreateColumn(columnsToCreate);
		return recursiveColum(columnsToCreate - 1);
	}
	await new Promise((resolve, reject) => {
		recursiveColum(12);
		resolve();
	});
}
export { GameStart, CreateImg };
