import CreateFruit from "./CreateFruit.js";
import { CreateImg } from "./GameStart.js";
import randomFruit from "./RandomFruit.js";

let fruit1 = new CreateImg();
let fruit2 = new CreateImg();
let fruit3 = new CreateImg();
let fruit4 = new CreateImg();
let fruit5 = new CreateImg();
let fruit6 = new CreateImg();
let fruit7 = new CreateImg();

const arrayOfFruits = [fruit1, fruit2, fruit3, fruit4, fruit5, fruit6, fruit7];
$(function () {
	// $("main").prepend(arrayOfFruits);
	console.log(arrayOfFruits);
	const div = document.createElement("div");
	const parent = $(div).addClass("col-1").prepend(arrayOfFruits);
	$(".row").prepend(parent);

	arrayOfFruits.pop();
	arrayOfFruits.pop();
	arrayOfFruits.pop();
	arrayOfFruits.pop();
	console.log(arrayOfFruits);
});
