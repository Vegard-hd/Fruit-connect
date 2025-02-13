import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 6,
  dictionary: "alpha_upper",
});

export function randomFruit() {
  const pear = `/assets/pear.svg`;
  const mango = `/assets/mango.svg`;
  const lemon = `/assets/lemon.svg`;
  const orange = `/assets/orange.svg`;
  const apple = `/assets/apple.svg`;
  const plum = `/assets/plum.svg`;
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
