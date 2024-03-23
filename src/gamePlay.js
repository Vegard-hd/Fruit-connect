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
async function removeFruit(target) {
	const remove = () => {
		$(target).remove();
	};
	const myPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 200);
	});
	await myPromise.then(remove);
}
async function insertFruitTop(target) {
	console.log("InsertFruit called!");
	const thisClass = $(target).attr("class");

	const thisColumnNumber = () => {
		if (thisClass.length === 16) return thisClass.at(-1);
		let twoDigitClassEnd = thisClass.at(-2) + thisClass.at(-1);
		return twoDigitClassEnd;
	};
	const currentColumn = thisColumnNumber();
	const columnSelector = `#column-${currentColumn}`;
	const newFruit = CreateImg().addClass(`inside-col-${columnSelector}`);
	const myPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
			console.log("Resolved Promise");
		}, 400);
	});
	function insertFruit() {
		console.log("insertFruit called");
		return $(columnSelector).prepend(newFruit);
	}
	await myPromise.then(insertFruit).then(observeDom(currentColumn));
	// observeDom(thisColumnNumber());
}
function removeHandler() {
	$("img").on("click", function () {
		removeFruit(this);
	});
}
function addFruitHandler() {
	$("img").on("click", function () {
		insertFruitTop(this);
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
		GameStart()
			.then(setUpObservers(12))
			.then(removeHandler)
			.then(addFruitHandler);
	});
});
