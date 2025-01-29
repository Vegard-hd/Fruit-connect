const randomfruit = require("./randomFruit").default;
class FruitGrid {
  _reviver(key, value) {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      }
    }
    return value;
  }
  _replacer(key, value) {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  gridOfFruits = new Array();
  initGrid() {
    for (let i = 0; i <= 119; i++) {
      this.gridOfFruits.push(randomfruit());
    }
    // console.table(this.gridOfFruits);
  }
  stringifyFruits() {
    return JSON.stringify(this.gridOfFruits);
  }
  parseFruits() {
    return JSON.parse(this.gridOfFruits);
  }
}
module.exports = FruitGrid;
