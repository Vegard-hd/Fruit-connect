import randomFruit from "./RandomFruit.js";
$(function () {
	function controlRow1() {
		if ($("#row1")[0].childNodes.length >= 10) return;
		else {
			$("#row1").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow2() {
		if ($("#row2")[0].childNodes.length >= 10) return;
		else {
			$("#row2").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow3() {
		if ($("#row3")[0].childNodes.length >= 10) return;
		else {
			$("#row3").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow4() {
		if ($("#row4")[0].childNodes.length >= 10) return;
		else {
			$("#row4").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow5() {
		if ($("#row5")[0].childNodes.length >= 10) return;
		else {
			$("#row5").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow6() {
		if ($("#row6")[0].childNodes.length >= 10) return;
		else {
			$("#row6").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow7() {
		if ($("#row7")[0].childNodes.length >= 10) return;
		else {
			$("#row7").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow8() {
		if ($("#row8")[0].childNodes.length >= 10) return;
		else {
			$("#row8").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow9() {
		if ($("#row9")[0].childNodes.length >= 10) return;
		else {
			$("#row9").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow10() {
		if ($("#row10")[0].childNodes.length >= 10) return;
		else {
			$("#row10").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow11() {
		if ($("#row11")[0].childNodes.length >= 10) return;
		else {
			$("#row11").prepend(randomFruit());
			populateGame();
		}
	}
	function controlRow12() {
		if ($("#row12")[0].childNodes.length >= 10) return;
		else {
			$("#row12").prepend(randomFruit());
			populateGame();
		}
	}
	function populateGame() {
		controlRow1();
		controlRow2();
		controlRow3();
		controlRow4();
		controlRow5();
		controlRow6();
		controlRow7();
		controlRow8();
		controlRow9();
		controlRow10();
		controlRow11();
		controlRow12();
	}
	function checkForEqual(prevFruit, nextFruit, thisFruit) {
		console.log(prevFruit, nextFruit, thisFruit);
		if (prevFruit === thisFruit && nextFruit === thisFruit)
			console.log("3 equal");
		else if (prevFruit === thisFruit || nextFruit === thisFruit)
			console.log("2 equal");
	}
	function getJustRowNum(input = "") {
		const numberPattern = /\d+/g;
		return input.match(numberPattern);
	}
	function getNextFruit(row = 1, fruitNum = 1) {
		let output = null;
		let targetID = `row${row}`;
		$("#gridWrapper")
			.children()
			.each(function (index, element) {
				let thisID = $(element).attr("id");
				if (thisID === targetID) {
					let justRowNum = getJustRowNum(thisID)[0];
					justRowNum = Number.parseInt(justRowNum, 10);
					let nextFruitHTML = $(`#row${justRowNum}`);
					nextFruitHTML = nextFruitHTML.children()[fruitNum];
					output = $(nextFruitHTML).attr("src");
				}
			});
		return output;
	}
	populateGame();
	$("img").on("click", async function () {
		let thisFruitSRC = $(this).attr("src");
		let clickedRow = $(this).parent().attr("id");
		let rowNum = getJustRowNum(clickedRow)[0];
		rowNum = Number.parseInt(rowNum, 10);
		let verticalFruitNum = $(this).prevAll().length;
		verticalFruitNum = Number.parseInt(verticalFruitNum, 10);
		let nextFruit = getNextFruit(rowNum + 1, verticalFruitNum);
		let prevFruit = getNextFruit(rowNum - 1, verticalFruitNum);
		checkForEqual(nextFruit, prevFruit, thisFruitSRC);
		await $(this).remove();
		populateGame();
	});
});
