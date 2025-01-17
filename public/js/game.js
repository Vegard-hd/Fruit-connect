// REF: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map

$(function () {
  updateGrid();
  async function updateGrid() {
    return await $.get("/fruitgrid", function (data) {
      try {
        const backToObj = JSON.parse(data);
        console.log(backToObj);
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
          console.log(count, rowCount, fruit, src, id);
        });
        console.log(backToObj);
      } catch (error) {
        console.error(error);
        console.warn("something went wrong with getting the fruit data");
      }
    });
  }

  $(document).on("click", function (e) {
    if (e.target.tagName === "IMG") {
      let yAxis = 11;
      let fruitId, parentRow, lastFruit;
      parentRow = $(e.target).parent()[0].id;
      const regex = /[0-9][0-9]/g;
      const regex2 = /[0-9]/;
      let clickedRow =
        regex.exec(parentRow)?.[0] ?? regex2.exec(parentRow)?.[0];
      fruitId = $(e.target)[0].id;
      lastFruit = $(e.target)[0];
      while (lastFruit) {
        yAxis--;
        lastFruit = $(lastFruit).next();
        if (!lastFruit[0]) break;
      }
      let output = {
        clickedRow: clickedRow,
        fruitId: fruitId,
        yAxis: yAxis,
      };
      output = JSON.stringify(output);
      $.post("/fruitgrid", { fruitData: output }).done(function (data) {
        // $(`#row${Number.parseInt(clickedRow, 10)}`).empty();
        // updateGrid();
        location.reload();
      });
    }
  });
});
