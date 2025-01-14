// REF: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

// convert back to JS obj
// console.log(backToObj);
$.get("/fruitgrid/all", function (data) {
  console.log(data);
});

$.get("/fruitgrid", function (data) {
  // $(".result").html(data);
  const backToObj = JSON.parse(data, reviver);
  // alert("Load was performed.");
  let count = 0;
  let rowCount = 0;
  backToObj.forEach((element) => {
    count++;
    if (count > 12) {
      count = 0;
      rowCount += 1;
    }
    console.log(count, rowCount);
    $(`#row${count}`).append(
      `<img src="${element.src}" alt="${element.fruit}" />`
    );
  });
  console.log(backToObj);
});
