import randomFruit from "./RandomFruit.js";
function CreateImg() {
	const img = document.createElement("img");
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
	// return recursiveColum(12);
}
export { GameStart, CreateImg };
