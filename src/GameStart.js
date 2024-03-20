import randomFruit from "./RandomFruit.js";
export default function GameStart() {
	function CreateImg() {
		const img = document.createElement("img");
		return $(img)
			.addClass("col")
			.attr("src", randomFruit())
			.attr("alt", "a fruit");
	}

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
	const recursiveColum = (columnsToCreate) => {
		if (columnsToCreate <= 0) return;
		CreateColumn(columnsToCreate);
		return recursiveColum(columnsToCreate - 1);
	};
	return recursiveColum(12);
}
