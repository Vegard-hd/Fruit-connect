import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 6,
  dictionary: "alpha_upper",
});

const fruits = [
  { name: "pineapple", path: "/assets/pineapple.png" },
  { name: "blueberry", path: "/assets/blueberry.png" },
  { name: "banana", path: "/assets/banana.png" },
  { name: "mango", path: "/assets/mango.png" },
  { name: "lemon", path: "/assets/lemon.png" },
  { name: "orange", path: "/assets/orange.png" },
  { name: "apple", path: "/assets/apple.png" },
  { name: "plum", path: "/assets/plum.png" },
];

export function randomFruit() {
  // Generate a random index based on the length of the fruits array
  const randomIndex = Math.floor(Math.random() * fruits.length);

  // Get the random fruit object from the array
  const selectedFruit = fruits[randomIndex];

  return {
    fruit: selectedFruit.name,
    src: selectedFruit.path,
    id: randomUUID(),
  };
}
