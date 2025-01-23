module.exports = {
  /**
   * Finds all connected fruits matching the fruit at 'startIndex'
   * in a grid of 'height' rows and 'width' columns.
   */
  async findConnectedFruits(gameFruitArr, startIndex, width = 10, height = 12) {
    const promise = await new Promise((resolve, reject) => {
      const startFruit = gameFruitArr[startIndex].i.fruit; // Fruit type at starting cell
      const visited = new Set(); // Track visited indices
      const stack = [startIndex]; // DFS stack (or use queue for BFS)

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
          continue;
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
      // items we haven't shifted yet. (Or group by row if you prefer row-by-row approach.)
      const sortedIndices = Array.from(indicesToRemove).sort((a, b) => a - b);

      for (const index of sortedIndices) {
        // Calculate which row the index is in
        const row = Math.floor(index / width);
        const rowStart = row * width; // start index of this row
        const rowEnd = rowStart + width - 1;

        // Shift all fruits from rowStart...index-1 downward by one slot
        // For example, if index = 32, we shift [rowStart...31] downward into [rowStart+1...32].
        for (let i = index; i > rowStart; i--) {
          // Copy the fruit above into current position
          gameFruitArr[i] = gameFruitArr[i - 1];
        }

        // Place a new fruit at the start of the row (rowStart)
        const newFruitObject = { i: randomFruit() }; // e.g. returns { fruit: "cherry", id: 999 }
        gameFruitArr[rowStart] = newFruitObject;
        // gameFruitArr[rowStart].i.id = newFruitObject.id;
      }
      resolve(gameFruitArr);
    });
    return await promise;
  },
};
