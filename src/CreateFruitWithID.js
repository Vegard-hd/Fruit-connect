import CreateFruit from "./createFruit.js";
export default class CreateFruitWithID extends CreateFruit {
	constructor(whatfruit, rownumber, id) {
		super(whatfruit, rownumber);
		this.id = id;
	}
	cloneFruit() {
		super.cloneFruit();
		$(this.target).attr("id", this.id);
	}
}
