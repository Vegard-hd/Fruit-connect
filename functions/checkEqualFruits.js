module.exports = {
  calculateEqualFruits(gameFruitArr, clickedIndex, rowIndex, rowStart, rowEnd) {
    const maxRow = 11 - rowIndex;
    const deletedFruitIds = new Set();

    const clickedFruit = gameFruitArr[clickedIndex].i.fruit;
    deletedFruitIds.add(gameFruitArr[clickedIndex]?.i?.id);
    let rightMulti = 10;
    let prevFruitRight = clickedFruit;
    for (let r = 0; r < maxRow; r++) {
      let nextFruit = gameFruitArr[clickedIndex + rightMulti]?.i?.fruit;
      let thisId = gameFruitArr[clickedIndex + rightMulti]?.i?.id;
      if (prevFruitRight !== nextFruit) {
        break;
      } else {
        rightMulti += 10;
        deletedFruitIds.add(thisId);
        prevFruitRight = nextFruit;
      }
    }
    //
    let leftMulti = -10;
    let prevFruitLeft = clickedFruit;
    for (let l = 11; l > maxRow; l--) {
      let nextFruit = gameFruitArr[clickedIndex + leftMulti]?.i?.fruit;
      let thisId = gameFruitArr[clickedIndex + leftMulti]?.i?.id;

      if (prevFruitLeft !== nextFruit) {
        break;
      } else {
        leftMulti -= 10;
        deletedFruitIds.add(thisId);
        prevFruitLeft = nextFruit;
      }
    }

    console.table(deletedFruitIds);
    return deletedFruitIds;
  },
  calculateRow(index) {
    let check;
    try {
      check = Number.parseInt(index);
    } catch (error) {
      check = -1;
    }

    let group = Math.floor(check / 10);

    switch (group) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 6:
        return 6;
      case 7:
        return 7;
      case 8:
        return 8;
      case 9:
        return 9;
      case 10:
        return 10;
      case 11:
        return 11;
      default:
        return -1; // for indexes outside 0-119, though this won't happen with inputs 0-119
    }
  },
};
