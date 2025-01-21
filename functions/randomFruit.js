const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({
  length: 6,
  dictionary: "alpha_upper",
});

function randomFruit() {
  const pear = `/assets/fruit-pear-pears-svgrepo-com.svg`;
  const mango = `/assets/fruit-manga-mango-svgrepo-com.svg`;
  const lemon = `/assets/fruit-limao-limon-svgrepo-com.svg`;
  const orange = `/assets/fruit-laranja-orange-svgrepo-com.svg`;
  const apple = `/assets/apple-apples-fruit-svgrepo-com.svg`;
  const plum = `/assets/ameixa-fruit-plum-svgrepo-com.svg`;
  let svgSrc;
  let fruitType;
  let rNum = Math.floor(Math.random() * 6 + 1);

  switch (rNum) {
    case 1:
      svgSrc = pear;
      fruitType = "pear";
      break;
    case 2:
      svgSrc = mango;
      fruitType = "mango";
      break;
    case 3:
      svgSrc = lemon;
      fruitType = "lemon";
      break;
    case 4:
      svgSrc = orange;
      fruitType = "orange";
      break;
    case 5:
      svgSrc = apple;
      fruitType = "apple";
      break;
    case 6:
      svgSrc = plum;
      fruitType = "plum";
      break;
  }
  return {
    fruit: fruitType,
    src: svgSrc,
    id: randomUUID(),
  };
}

module.exports = randomFruit;
