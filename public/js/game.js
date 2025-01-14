// REF: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

$.get("/fruitgrid", function (data) {
  // $(".result").html(data);
  const backToObj = JSON.parse(data, reviver);
  // alert("Load was performed.");
  let count = 0;
  let rowCount = 0;
  const iterator1 = backToObj.keys();
  backToObj.forEach((element) => {
    let key = iterator1.next().value;
    count++;
    if (count > 12) {
      count = 0;
      rowCount += 1;
    }
    console.log(count, rowCount, key);
    $(`#row${count}`).append(
      `<img id="${key}" src="${element.src}" alt="${element.fruit}" />`
    );
  });
  console.log(backToObj);
});

$(function () {
  $(document).on("click", function (e) {
    console.log($(e.target).parent());
  });
});
