import randomFruit from "./RandomFruit.js";
$(function () {
	function populateGame() {
		if ($("#row1")[0].childNodes.length >= 10) return;
		else {
			$("#row1").prepend(randomFruit());
			populateGame();
		}
		if ($("#row2")[0].childNodes.length >= 10) return;
		else {
			$("#row2").prepend(randomFruit());
			populateGame();
		}
		if ($("#row3")[0].childNodes.length >= 10) return;
		else {
			$("#row3").prepend(randomFruit());
			populateGame();
		}
		if ($("#row4")[0].childNodes.length >= 10) return;
		else {
			$("#row4").prepend(randomFruit());
			populateGame();
		}
		if ($("#row5")[0].childNodes.length >= 10) return;
		else {
			$("#row5").prepend(randomFruit());
			populateGame();
		}

		if ($("#row6")[0].childNodes.length >= 10) return;
		else {
			$("#row6").prepend(randomFruit());
			populateGame();
		}
		if ($("#row7")[0].childNodes.length >= 10) return;
		else {
			$("#row7").prepend(randomFruit());
			populateGame();
		}
		if ($("#row8")[0].childNodes.length >= 10) return;
		else {
			$("#row8").prepend(randomFruit());
			populateGame();
		}
		if ($("#row9")[0].childNodes.length >= 10) return;
		else {
			$("#row9").prepend(randomFruit());
			populateGame();
		}
		if ($("#row10")[0].childNodes.length >= 10) return;
		else {
			$("#row10").prepend(randomFruit());
			populateGame();
		}
		if ($("#row11")[0].childNodes.length >= 10) return;
		else {
			$("#row11").prepend(randomFruit());
			populateGame();
		}
		if ($("#row12")[0].childNodes.length >= 10) return;
		else {
			$("#row12").prepend(randomFruit());
			populateGame();
		}
	}
	populateGame();
	$("img").on("click", async function () {
		await $(this).remove();
		populateGame();
	});
	let row = $("#gridWrapper")[0].children;
	$.each(row, function (indexInArray, valueOfElement) {
		console.log(valueOfElement);
	});
	console.log(row);
});
