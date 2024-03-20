import { GameStart, CreateImg } from "./GameStart.js";
function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	console.log(targetNode);
	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				console.log("A child node has been added or removed.");
			} else if (mutation.type === "attributes") {
				console.log(`The ${mutation.attributeName} attribute was modified.`);
			}
		}
	};
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);
	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
	// Later, you can stop observing
	// observer.disconnect();
}
function setUpObservers(numberOfObservers) {
	if (numberOfObservers <= 0) return;
	console.log(numberOfObservers);
	observeDom(numberOfObservers);
	return setUpObservers(numberOfObservers - 1);
}
function clickHandler() {
	return $("img").on("click", function () {
		let thisClass = $(this).attr("class");
		$(this).remove();
		const thisColumnNumber = () => {
			if (thisClass.length === 16) return thisClass.at(-1);
			let twoDigitClassEnd = thisClass.at(-2) + thisClass.at(-1);
			return twoDigitClassEnd;
		};
		console.log(thisColumnNumber());
		let columnSelector = `#column-${thisColumnNumber()}`;
		return $(columnSelector).prepend(CreateImg());
	});
}

$(function () {
	$("button").one("click", function () {
		console.log("clicked start");
		GameStart().then(setUpObservers(12)).then(clickHandler());
	});
});
