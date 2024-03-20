import { GameStart, CreateImg } from "./GameStart.js";
function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				console.log(observer);
				observer.disconnect();
			}
		}
	};
	const observer = new MutationObserver(callback);
	// Create an observer instance linked to the callback function
	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
	// Later, you can stop observing
	// observer.disconnect();
}
function setUpObservers(numberOfObservers) {
	if (numberOfObservers <= 0) return;
	observeDom(numberOfObservers);
	return setUpObservers(numberOfObservers - 1);
}

//TODO bind new onClick event to each new fruit
//make a new function CreateFruitWithEventListener
//That abstracts logic from clickHandler
function clickHandler() {
	$("img").on("click", function () {
		let thisClass = $(this).attr("class");
		$(this).remove();
		const thisColumnNumber = () => {
			if (thisClass.length === 16) return thisClass.at(-1);
			let twoDigitClassEnd = thisClass.at(-2) + thisClass.at(-1);
			return twoDigitClassEnd;
		};
		let columnSelector = `#column-${thisColumnNumber()}`;
		let newFruit = CreateImg().addClass(`inside-col-${thisColumnNumber()}`);
		$(columnSelector)
			.prepend(newFruit)
			.on("click", function () {});
		observeDom(thisColumnNumber());
	});
}

$(function () {
	$("button").one("click", function () {
		gsap.to($(".container-sm"), {
			duration: 0.5,
			opacity: 1,
			scale: 1,
			width: "100%",
			height: "100%",
			ease: "back.out(2)",
		});
		console.log("clicked start");
		GameStart().then(setUpObservers(12)).then(clickHandler());
	});
});
