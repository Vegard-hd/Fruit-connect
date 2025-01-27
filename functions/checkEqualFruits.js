module.exports = {
  /**
   * Finds all connected fruits matching the fruit at 'startIndex'
   * in a grid of 'height' rows and 'width' columns.
   */
  async findConnectedFruits(gameFruitArr, startIndex, width = 10, height = 12) {
    const promise = await new Promise((resolve, reject) => {
      const startFruit = gameFruitArr[startIndex].i.fruit; // Fruit type at starting cell
      const visited = new Set(); // Track visited indices
      const stack = [startIndex]; // DFS Depth first search algorith

      // Helper to safely check array bounds
      function inBounds(row, col) {
        return row >= 0 && row < height && col >= 0 && col < width;
      }

      // Convert index to (row, col)
      function toRowCol(index) {
        return {
          row: Math.floor(index / width),
          col: index % width,
        };
      }

      // Convert (row, col) back to index
      function toIndex(row, col) {
        return row * width + col;
      }

      while (stack.length > 0) {
        const currentIndex = stack.pop();
        if (visited.has(currentIndex)) {
          continue; // skips the itiration without breaking the loop
        }
        visited.add(currentIndex);

        // Get row, col for the current index
        const { row, col } = toRowCol(currentIndex);

        // Check each neighbor: up, down, left, right
        const neighbors = [
          { r: row - 1, c: col }, // up
          { r: row + 1, c: col }, // down
          { r: row, c: col - 1 }, // left
          { r: row, c: col + 1 }, // right
        ];
        for (const { r, c } of neighbors) {
          if (inBounds(r, c)) {
            const neighborIndex = toIndex(r, c);
            // If neighbor fruit matches the start fruit, visit it
            if (gameFruitArr[neighborIndex].i.fruit === startFruit) {
              stack.push(neighborIndex);
            }
          }
        }
      }

      // 'visited' now contains all indices that match
      resolve(visited);
    });
    return await promise;
  },

  /**
   * Removes all fruits from the given indices, shifting each fruit in that row
   * one position downward (toward higher indices), and inserts a new fruit at
   * the start of the row.
   *
   * @param {Array} gameFruitArr - The 1D array of fruit objects.
   * @param {Set|Array<number>} indicesToRemove - The set or array of indices to remove.
   * @param {Function} randomFruit - Function that returns a new fruit (e.g. { fruit: 'apple', id: 123 }).
   */
  async removeAndShiftFruits(gameFruitArr, indicesToRemove, randomFruit) {
    const promise = await new Promise((resolve, reject) => {
      const width = 10; // Number of columns in each row

      // Ensure we process from smaller to larger indices so we don’t overwrite
      // items we haven't shifted yet.
      const indexArr = indicesToRemove
        // .filter((element) => element?.index)
        .sort((a, b) => a?.index - b?.index);
      // const sortedIndices = Array.from(indicesToRemove).sort((a, b) => a - b);
      console.log(indexArr);
      for (const element of indexArr) {
        const index = element?.index;
        // Calculate which row the index is in
        const row = Math.floor(index / width);
        const rowStart = row * width; // start index of this row
        // const rowEnd = rowStart + width - 1;

        // Shift all fruits from rowStart...index-1 downward by one slot
        // For example, if index = 32, we shift [rowStart...31] downward into [rowStart+1...32].
        for (let i = index; i > rowStart; i--) {
          // Copy the fruit above into current position
          gameFruitArr[i] = gameFruitArr[i - 1];
        }

        // Place a new fruit at the start of the row (rowStart)
        const newFruitObject = { i: element.newFruit }; // e.g. returns { fruit: "cherry", id: 999 }
        gameFruitArr[rowStart] = newFruitObject;
        // gameFruitArr[rowStart].i.id = newFruitObject.id;
      }
      resolve(gameFruitArr);
    });
    return promise;
  },

  // Example usage:
  // const connectedIndices = findConnectedFruits(gameFruitArr, clickedIndex, 10, 12);
  // connectedIndices is a set of all indices with the same fruit connected to clickedIndex.
  fruitLogic(gameFruitArr, clickedIndex) {
    //return mutated array of gameFruit
    const arrOfIds = new Set();
    const lastRow = 11;
    const firstRow = 0;
    //add clicked fruit to Set;
    arrOfIds.add(gameFruitArr[clickedIndex].i.id);

    function traverseLeft(index) {
      const thisRow = calculateRow(index);
      for (let i = thisRow; i > firstRow; i--) {
        const thisFruit = gameFruitArr[index].i.fruit;

        // const nextFruitRight = gameFruitArr[i * 10].i.fruit;
        const nextFruitDown = gameFruitArr[index - 10].i.fruit;
        if (thisFruit === nextFruitDown) {
          arrOfIds.add(gameFruitArr[index - 10].i.id);
          index -= 10;
        } else break;
      }
    }
    function traverseRight(index) {
      const thisRow = calculateRow(index);
      for (let i = thisRow; i < lastRow; i++) {
        const thisFruit = gameFruitArr[index].i.fruit;

        // const nextFruitRight = gameFruitArr[i * 10].i.fruit;
        const nextFruitDown = gameFruitArr[index + 10].i.fruit;
        if (thisFruit === nextFruitDown) {
          arrOfIds.add(gameFruitArr[index + 10].i.id);
          index += 10;
        } else break;
      }
    }

    function traverseDown(index) {
      for (let i = index; i < gameFruitArr.length; i++) {
        traverseRight(i);
        traverseLeft(i);
        const thisRow = calculateRow(index);
        const thisRowStart = thisRow * 10;
        const thisRowEnd = thisRowStart + 9;

        if (i < thisRowStart || i > thisRowEnd) {
          return;
        }
        const thisFruit = gameFruitArr[i].i.fruit;

        const nextFruitDown = gameFruitArr[i + 1].i.fruit;
        if (thisFruit === nextFruitDown) {
          arrOfIds.add(gameFruitArr[i + 1].i.id);
        } else break;
      }
    }
    function traverseUp(index) {
      for (let i = index; i > 0; i--) {
        traverseRight(i);
        traverseLeft(i);
        const thisRow = calculateRow(index);
        const thisRowStart = thisRow * 10;
        const thisRowEnd = thisRowStart + 9;

        if (i < thisRowStart || i > thisRowEnd) {
          return;
        }
        const thisFruit = gameFruitArr[i].i.fruit;

        const nextFruitDown = gameFruitArr[i - 1].i.fruit;
        if (thisFruit === nextFruitDown) {
          arrOfIds.add(gameFruitArr[i - 1].i.id);
        } else break;
      }
    }
    traverseDown(clickedIndex);
    traverseUp(clickedIndex);

    function replaceFruit(index, row) {}

    function calculateRow(index) {
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
    }
  },

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

    // console.table(deletedFruitIds);
    return deletedFruitIds;
  },
};
