import { GameStart, CreateImg } from "./GameStart.js";
var score = null;
function observeDom(target = 1) {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById(`column-${target}`);
	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	// Callback function to execute when mutations are observed
	const callback = async (mutationList, observer) => {
		const currentNodelist = mutationList[0].target.childNodes;
		async function checkIf3Equal(target) {
			const myPromise = new Promise((resolve) => {
				let currentImg = $(target).parents();
				let imgArr = currentImg[0].childNodes;
				console.log(currentImg);
				console.log(imgArr);
				console.log(target);
			});
			await myPromise;
		}
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
	$("#score").text(`Score: ${score}`);
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
							await removeFruit(this).then(insertFruitTop(element));
						});
					}
				});
			});
	});
});
