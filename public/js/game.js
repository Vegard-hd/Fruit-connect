$(async function () {
  async function updateGrid(newData) {
    const promise = await new Promise((resolve, reject) => {
      const newDataObj = JSON.parse(newData);
      const mappedObj = newDataObj.map((element) => {
        return {
          row: Math.floor(element.index / 10),
          index: element.index,
          col: element.index % 10,
          newFruit: element.newFruit,
        };
      });
      mappedObj.forEach((element) => {
        const thisrow = element.row + 1;
        const thisFruit = [...$(`#row${thisrow}`).children()].find(
          (val, index) => index === element.col
        );
        $(thisFruit).remove();
        $(`#row${thisrow}`).prepend(
          `<img id="${element.newFruit.id}" src="${element.newFruit.src}" alt="${element.newFruit.fruit}" />`
        );
      });
      resolve("success");
    });
    return await promise;
  }

  async function initGrid(data, init = false) {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        if (init === true) {
          for (let i = 1; i <= 12; i++) {
            $(`#row${i}`).empty();
          }
          // clear fruits;
        }
        const backToObj = await JSON.parse(data);
        let count = 0;
        let rowCount = 1;
        backToObj.forEach((element, index) => {
          let fruit = element.i.fruit;
          let src = element.i.src;
          let id = element.i.id;
          count++;
          $(`#row${rowCount}`).append(
            `<img id="${id}" src="${src}" alt="${fruit}" />`
          );
          if (count >= 10) {
            count = 0;
            rowCount++;
          }
        });
        setTimeout(() => {
          resolve();
        }, 1000);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
    return await myPromise;
  }

  await (await fetch("/fruitgrid")).json().then(async (data) => {
    await initGrid(data, false);
  });

  $(document).on("click", async function (e) {
    if (e.target.tagName === "IMG") {
      let fruitId;
      fruitId = await $(e.target)[0].id;

      if (!fruitId) return;
      const reqBody = JSON.stringify({ fruit: fruitId });
      const request = new Request("/fruitgrid", {
        method: "POST",
        body: reqBody,
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetch(request).then((response) => {
        response.json().then(async (newData) => {
          await updateGrid(newData);
        });
      });
    }
  });
});
