import { GameStart, CreateImg } from "./GameStart.js";
function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			console.log(mutation.target.firstChild);
			mutation.target.firstChild.addEventListener("click", function () {
				insertFruitTop(this), removeFruit(this);
			});
			// console.log(mutation.target.firstchild);
			if (mutation.type === "childList") {
				console.log(observer);
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
	const newFruit = CreateImg().addClass(`inside-col-${currentColumn}`);
	const myPromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
			console.log("Resolved Promise");
		}, 400);
	});
	function insertFruit() {
		$(columnSelector).prepend(newFruit);
		// Object.assign(newFruit, addFruitHandler());
	}
	await myPromise.then(insertFruit);
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
function testHandler() {
	return console.log("this is a test handler");
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
			.then(removeHandler)
			.then(addFruitHandler)
			.then(setUpObservers(12));
	});
});
