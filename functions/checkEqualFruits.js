import { FruitService } from "../services/FruitService";
import { randomFruit } from "./randomFruit";
const fruitService = new FruitService();
const ScoreService = require("../services/ScoreService");
const scoreService = new ScoreService();
export /**
 * Finds all connected fruits matching the fruit at 'startIndex'
 * in a grid of 'height' rows and 'width' columns.
 */
async function findConnectedFruits(
  gameFruitArr,
  startIndex,
  width = 10,
  height = 12
) {
  const promise = await new Promise((resolve, reject) => {
    const startFruit = gameFruitArr[startIndex].fruit; // Fruit type at starting cell
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
          if (gameFruitArr[neighborIndex].fruit === startFruit) {
            stack.push(neighborIndex);
          }
        }
      }
    }

    // 'visited' now contains all indices that match
    resolve(visited);
  });
  return await promise;
}
export /**
 * Removes all fruits from the given indices, shifting each fruit in that row
 * one position downward (toward higher indices), and inserts a new fruit at
 * the start of the row.
 *
 * @param {Array} gameFruitArr - The 1D array of fruit objects.
 * @param {Set|Array<number>} indicesToRemove - The set or array of indices to remove.
 * @param {Function} randomFruit - Function that returns a new fruit (e.g. { fruit: 'apple', id: 123 }).
 */
async function removeAndShiftFruits(
  gameFruitArr,
  indicesToRemove,
  randomFruit
) {
  const promise = await new Promise((resolve, reject) => {
    const width = 10; // Number of columns in each row

    // Ensure we process from smaller to larger indices so we don’t overwrite
    // items we haven't shifted yet.
    const indexArr = indicesToRemove
      // .filter((element) => element?.index)
      .sort((a, b) => a?.index - b?.index);
    // const sortedIndices = Array.from(indicesToRemove).sort((a, b) => a - b);
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
      gameFruitArr[rowStart] = element.newFruit;
      // gameFruitArr[rowStart].i.id = newFruitObject.id;
    }
    resolve(gameFruitArr);
  });
  return promise;
}

export async function calculateFruitsDfs(userData, userId) {
  try {
    let gameEnded = false;
    // 1) Retrieve or create the stored data

    let data = await fruitService.getOne(userId);
    if (!data) {
      await fruitService.create(userId);
      data = await fruitService.getOne(userId);
    }
    if (data.moves < 0) {
      gameEnded = true;
    }
    const gameFruitArr = JSON.parse(data.fruitgrid);
    const userDataToJson = JSON.parse(userData)?.fruit;
    if (!userDataToJson) {
      throw new Error("No fruit id found in the request");
    }
    const clickedIndex = gameFruitArr.findIndex(
      (element) => element?.id === userDataToJson
    );

    // If the fruit isn't found, handle error
    if (clickedIndex === -1) {
      throw new Error("No fruit id found in the request");
    }

    //handle extra check to match backend fruit type with userinput

    const connectedIndices = await findConnectedFruits(
      gameFruitArr,
      clickedIndex,
      10,
      12
    );

    let score = 0;
    if (connectedIndices.size >= 3) {
      score = connectedIndices?.size
        ? connectedIndices?.size * connectedIndices?.size
        : 1;
      score = Number.parseInt(score, 10);
    }

    // const getScore = async () => {
    //   let score = await scoreService.getOne(1);
    //   if (!score) {
    //     await scoreService.create();
    //     score = scoreService.getOne(1);
    //   }
    //   return score;
    // };

    const indexPlusNewFruit = [...connectedIndices].map((element) => {
      return {
        index: element,
        newFruit: randomFruit(),
      };
    });

    const finishedArr = await removeAndShiftFruits(
      gameFruitArr,
      indexPlusNewFruit,
      randomFruit
    );
    const jsonFruitGrid = JSON.stringify(finishedArr);
    await fruitService.update(jsonFruitGrid, userId); //rewrites entire fruitGameArr

    const jsonNewDataAndFruit = JSON.stringify(indexPlusNewFruit); // sends only indexes to remove + newFruits
    return [jsonNewDataAndFruit, score, gameEnded, data?.moves];
  } catch (error) {
    console.warn(error);
  }
}
