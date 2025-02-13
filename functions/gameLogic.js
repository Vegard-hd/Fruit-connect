import { FruitService } from "../services/FruitService";
import { randomFruit } from "./randomFruit";
const fruitService = new FruitService();
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
async function removeAndShiftFruits(gameFruitArr, indicesToRemove) {
  const promise = await new Promise((resolve, reject) => {
    const width = 10; // Number of columns in each row

    const indexArr = indicesToRemove.sort((a, b) => a?.index - b?.index);
    for (const element of indexArr) {
      const index = element?.index;
      // Calculate which row the index is in
      const row = Math.floor(index / width);
      const rowStart = row * width; // start index of this row

      for (let i = index; i > rowStart; i--) {
        // Copy the fruit above into current position
        gameFruitArr[i] = gameFruitArr[i - 1];
      }

      // Place a new fruit at the start of the row (rowStart)
      gameFruitArr[rowStart] = element.newFruit;
    }
    resolve(gameFruitArr);
  });
  return promise;
}

export default async function gameCalculationsV1(userData, userId) {
  try {
    let data = await fruitService.getOne(userId);
    if (!data) throw new Error("Failed to retrieve data ");

    const gameFruitArr = JSON.parse(data.fruitgrid);
    const userDataToJson = JSON.parse(userData)?.fruit;
    if (!userDataToJson) {
      throw new Error("No fruit id found in the request");
    }
    const clickedIndex = gameFruitArr.findIndex(
      (element) => element?.id === userDataToJson
    );

    //throws if the fruit id user provides is not in the fruitgrid
    if (clickedIndex === -1) {
      throw new Error("No fruit id found in the request");
    }

    const connectedIndices = await findConnectedFruits(
      gameFruitArr,
      clickedIndex,
      10,
      12
    );

    //updates score if three or more fruits are next to eachother
    let score = 0;
    if (connectedIndices.size >= 3) {
      score = connectedIndices?.size
        ? connectedIndices?.size * connectedIndices?.size
        : 1;
      score = Number.parseInt(score, 10);
    }

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
    await Promise.all([
      await fruitService.update(jsonFruitGrid, userId, score),
      await fruitService.updateScore(score, userId),
      await fruitService.decrementMoves(userId),
    ]).catch((e) => {
      throw new Error("Failed to write to the database");
    });

    const jsonNewDataAndFruit = JSON.stringify(indexPlusNewFruit); // sends only indexes to remove + newFruits
    return jsonNewDataAndFruit;
  } catch (error) {
    console.warn(error);
  }
}
