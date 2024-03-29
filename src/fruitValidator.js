var score = 0;

function updateScore(numberToIncrease) {
	score += numberToIncrease;
	$("#score").text(`Score: ${score}`);
}

function checkForEqualFruits(previusFruit, clickedFruit, nextfruit) {
	if (previusFruit === clickedFruit) console.log("Two fruits match");
	if (nextfruit === clickedFruit) console.log("Two fruits match");
	if (nextfruit === clickedFruit && previusFruit === clickedFruit)
		updateScore(100);
}

function checkForEqualFruitColumns(
	previusColumnFruit,
	currentFruit,
	nextColumnFruit
) {
	if (previusColumnFruit === currentFruit && nextColumnFruit === currentFruit)
		updateScore(100);
}
export { checkForEqualFruits, checkForEqualFruitColumns };
