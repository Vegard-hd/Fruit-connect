import randomFruit from "./RandomFruit.js";
$(function () {
	let arrayOfFruitsOne = [];
	function recursiveFruitPusher(input = []) {
		if (input.length < 10) {
			input.push(randomFruit());
			recursiveFruitPusher(input);
		}
	}
	recursiveFruitPusher(arrayOfFruitsOne);

	arrayOfFruitsOne.forEach((elmnt) => {
		$("#row1").prepend(elmnt);
		$("#row2").prepend(elmnt);
		$("#row3").prepend(elmnt);
		$("#row4").prepend(elmnt);
		$("#row5").prepend(elmnt);
		$("#row6").prepend(elmnt);
		$("#row7").prepend(elmnt);
		$("#row8").prepend(elmnt);
		$("#row9").prepend(elmnt);
		$("#row10").prepend(elmnt);
		$("#row11").prepend(elmnt);
		$("#row12").prepend(elmnt);
	});
});
