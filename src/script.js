import randomFruit from "./RandomFruit.js";
import CreateFruit from "./CreateFruit.js";
async function manageColumn(columnNum = 1, gameOnOff = false) {
	while (
		gameOnOff === true &&
		CreateFruit.countFruitsInColumn(columnNum) <= 7
	) {
		await new Promise((resolve, reject) => {
			setTimeout(() => {
				new CreateFruit(randomFruit(), columnNum);
				resolve(); // Resolve the promise
			}, 200);
		});
	}
	eventListener();
}

// Example usage:
manageColumn(1, true);

const replaceFruit = (target) => {
	let cloned = $(target).clone();
	let extractedClass = cloned.$(target).remove();
	setInterval(() => {
		cloned.prependTo();
	}, 500);
};

function eventListener() {
	$("img").on("click", () => {});
}
