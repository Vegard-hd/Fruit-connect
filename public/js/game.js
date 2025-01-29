$(async function () {
  var init = false;
  const ws = new WebSocket("ws://localhost:3000/ws");
  ws.onmessage = async (event) => {
    if (event.data && !init) {
      init = true;
      await initGrid(event.data);
    } else {
      await updateGrid(event.data);
    }
    // $nowTime.textContent = event.data;
  };
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
      mappedObj.forEach(async (element) => {
        const thisrow = element.row + 1;
        const thisFruit = [...$(`#row${thisrow}`).children()].find(
          (val, index) => index === element.col
        );
        await gsap
          .to(thisFruit, {
            opacity: 0,
            scale: 2.5,
            duration: 0.1,
            ease: "elastic.out(2, 0.3)",
          })
          .then(() => $(thisFruit).remove())
          .then(() => {
            $(`#row${thisrow}`).prepend(
              `<img id="${element.newFruit.id}" src="${element.newFruit.src}" alt="${element.newFruit.fruit}" />`
            );
          });
        var tl = gsap.timeline({});

        const ge = `#${element.newFruit.id}`;
        tl.to(ge, { scale: 1.6, duration: 0.1 });
        tl.to(ge, { scale: 0.8, duration: 0.1 });
        tl.to(ge, { scale: 1, duration: 0.1, ease: "elastic.out(2,0.3)" });
      });
      resolve("success");
    });
    return await promise;
  }

  async function initGrid(data) {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const backToObj = await JSON.parse(data);
        let count = 0;
        let rowCount = 1;
        backToObj.forEach((element, index) => {
          let fruit = element.fruit;
          let src = element.src;
          let id = element.id;
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

  $(document).on("click", async function (e) {
    try {
      if (e.target.tagName === "IMG") {
        let fruitId = await $(e.target)[0].id;
        if (!fruitId) return;
        const reqBody = JSON.stringify({ fruit: fruitId });
        console.log(reqBody);
        ws.send(reqBody);
      }
    } catch (error) {
      console.warn(error);
    }
  });
});
