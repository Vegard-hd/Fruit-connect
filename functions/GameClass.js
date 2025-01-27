class GameClass {
  constructor(gameFruitArr, clickedIndex, rowIndex, rowStart, rowEnd) {
    this.gameFruitArr = gameFruitArr;
    this.clickedIndex = clickedIndex;
    this.rowIndex = rowIndex;
    this.rowStart = rowStart;
    this.rowEnd = rowEnd;
    this.deletedFruitIds = new Set();
  }

  calculateEqualFruits() {
    const maxRow = 11 - this.rowIndex;
    // const deletedFruitIds = new Set();

    const clickedFruit = this.gameFruitArr[this.clickedIndex]?.i?.fruit;

    let rightMulti = 10;
    let prevFruitRight = clickedFruit;
    for (let r = 0; r < maxRow; r++) {
      let nextFruit =
        this.gameFruitArr[this.clickedIndex + rightMulti]?.i?.fruit;
      let thisId = this.gameFruitArr[this.clickedIndex + rightMulti]?.i?.id;
      if (prevFruitRight !== nextFruit) {
        break;
      } else {
        rightMulti += 10;
        this.deletedFruitIds.add(thisId);
        prevFruitRight = nextFruit;
      }
    }
    //
    let leftMulti = -10;
    let prevFruitLeft = clickedFruit;
    for (let l = 11; l > maxRow; l--) {
      let nextFruit =
        this.gameFruitArr[this.clickedIndex + leftMulti]?.i?.fruit;
      let thisId = this.gameFruitArr[this.clickedIndex + leftMulti]?.i?.id;

      if (prevFruitLeft !== nextFruit) {
        break;
      } else {
        leftMulti -= 10;
        this.deletedFruitIds.add(thisId);
        prevFruitLeft = nextFruit;
      }
    }
    return this.deletedFruitIds;
  }
}

class TraverseGrid extends GameClass {
  constructor(gameFruitArr, clickedIndex, rowIndex, rowStart, rowEnd) {
    super(gameFruitArr, clickedIndex, rowIndex, rowStart, rowEnd);
  }
  travereseVertical() {
    let i = this.clickedIndex;
    i = Number.parseInt(i, 10);
    do {
      this.calculateEqualFruits(
        this.gameFruitArr,
        i,
        this.rowIndex,
        this.rowStart,
        this.rowEnd
      );
      i++;
    } while (
      this.gameFruitArr[i]?.i?.fruit ===
      this.gameFruitArr[this.clickedIndex]?.i?.fruit
    );
    return this.deletedFruitIds;
  }
}

module.exports = TraverseGrid;
