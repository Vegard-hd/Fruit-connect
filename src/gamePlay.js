import { GameStart, CreateImg } from "./GameStart.js";
import {
	checkForEqualFruits,
	checkForEqualFruitColumns,
} from "./fruitValidator.js";

async function checkIf3Equal(target) {
	let prevFruitSRC = null;
	let nextFruitSRC = null;
	let thisFruitSRC = null;
	let nextColumnFruitSRC = null;
	let previusColumnFruitSRC = null;
	let previusColum;
	let nextColumn;
	async function executer(target) {
		const myPromise = new Promise((resolve) => {
			thisFruitSRC = $(target).attr("src");
			let currentID = $(target).attr("id");
			let currentImg = $(target).parents();
			let imgArr = currentImg[0].childNodes;
			let currenFruitIndex = null;
			try {
				nextColumn = currentImg[0].nextElementSibling.childNodes;
				previusColum = currentImg[0].previousElementSibling.childNodes;
			} catch (error) {
				console.log(error);
			}
			imgArr.forEach((element, index) => {
				if ($(element).attr("id") === currentID) {
					currenFruitIndex = index;
				}
			});
			let prevFruitIndex = currenFruitIndex - 1;
			let nextFrutIndex = currenFruitIndex + 1;
			imgArr.forEach((element, index) => {
				if (index === prevFruitIndex) {
					prevFruitSRC = $(element).attr("src");
				}
				if (index === nextFrutIndex) {
					nextFruitSRC = $(element).attr("src");
				}
			});
			if (previusColum >= 1) {
				previusColum.forEach((element, index) => {
					if (index === currenFruitIndex) {
						previusColumnFruitSRC = $(element).attr("src");
					}
				});
			}
			if (!(nextColumn === null)) {
				nextColumn.forEach((element, index) => {
					if (index === currenFruitIndex) {
						nextColumnFruitSRC = $(element).attr("src");
					}
				});
			}
			resolve();
		});
		console.log(prevFruitSRC, thisFruitSRC, nextFruitSRC);
		await myPromise
			.then(checkForEqualFruits(prevFruitSRC, thisFruitSRC, nextFruitSRC))
			.then(
				checkForEqualFruitColumns(
					previusColumnFruitSRC,
					thisFruitSRC,
					nextColumnFruitSRC
				)
			);
	}
	await executer(target);
}

function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = async (mutationList, observer) => {
		async function removeThenAddFruits() {
			for (const iterator of mutationList[0].target.childNodes) {
				// console.log($(iterator).parents());

				if (!iterator.getAttribute("click-listener")) {
					iterator.setAttribute("click-listener", true);
					iterator.addEventListener("click", async function clickListener() {
						await checkIf3Equal(this)
							.then(removeFruit(this))
							.then(insertFruitTop(iterator));
					});
				}
			}
		}
		await removeThenAddFruits();
	};
	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}
function setUpObservers(numberOfObservers) {
	if (numberOfObservers <= 0) return;
	observeDom(numberOfObservers);
	return setUpObservers(numberOfObservers - 1);
}

async function removeFruit(target) {
	$(target).attr("id", "unclickable-element");
	const remove = () => {
		$(target).unbind();
		$(target).off();
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
	//Fruits that are created at runtime gets eventlistener
	$(newFruit)
		.on("mouseover", function () {
			gsap.to(this, {
				duration: 0.5,
				opacity: 1,
				scale: 1.4,
				ease: "back.out(2)",
			});
		})
		.on("mouseleave", function () {
			gsap.to(this, {
				duration: 0.5,
				opacity: 1,
				scale: 1,
				ease: "back.out(2)",
			});
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
						$(element)
							.on("mouseover", function () {
								gsap.to(this, {
									duration: 0.5,
									opacity: 1,
									scale: 1.4,
									ease: "back.out(2)",
								});
							})
							.on("mouseleave", function () {
								gsap.to(this, {
									duration: 0.5,
									opacity: 1,
									scale: 1,
									ease: "back.out(2)",
								});
							});
						element.addEventListener("click", async function clickListener() {
							await checkIf3Equal(element)
								.then(removeFruit(this))
								.then(insertFruitTop(element));
						});
					}
				});
			});
	});
});
