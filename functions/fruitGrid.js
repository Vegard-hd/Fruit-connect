import { randomFruit } from "./randomFruit";
export class FruitGrid {
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

  initGrid(force = true) {
    let gridOfFruits;
    if (force === true) {
      gridOfFruits = new Array();
      for (let i = 0; i <= 119; i++) {
        gridOfFruits.push(randomFruit());
      }
    }
    return gridOfFruits;
  }
  stringifyFruits(input) {
    return JSON.stringify(input);
  }
  parseFruits(input) {
    return JSON.parse(input);
  }
}
