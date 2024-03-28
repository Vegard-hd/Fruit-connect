import { GameStart, CreateImg } from "./GameStart.js";
function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const iterator of mutationList[0].target.childNodes) {
			if (!iterator.getAttribute("click-listener")) {
				iterator.setAttribute("click-listener", true);
				iterator.addEventListener("click", async function () {
					await removeFruit(this)
						.then(insertFruitTop(iterator))
						.then(function () {
							console.log($(iterator).parent());
						});
				});
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

async function removeFruit(target) {
	$(target).attr("id", "unclickable-element");
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
	}
	await myPromise.then(insertFruit);
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
			.then(removeHandler)
			.then(setUpObservers(12))
			.then(function () {
				$("img").each(function (index, element) {
					// element == this
					if (!element.getAttribute("click-listener")) {
						element.setAttribute("click-listener", true);
						element.addEventListener("click", async function () {
							await removeFruit(this)
								.then(insertFruitTop(element))
								.then(function () {
									console.log($(element).parent());
								});
						});
					}
				});
			});
	});
});
