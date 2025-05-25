import { randomFruit } from "./randomFruit";
let lastUpdate = Date.now();
let currentFruit = randomFruit();
let interval = 5000;
export function bonusFruit() {
  let now = Date.now();
  let remaining = now - lastUpdate;

  if (now - lastUpdate >= interval) {
    lastUpdate = now;
    let newFruit;
    do {
      newFruit = randomFruit();
    } while (newFruit === currentFruit); // Ensures new fruit is different

    currentFruit = newFruit;
    console.log("New fruit:", currentFruit);
  }
  //   return [currentFruit.fruit, currentFruit.src, remaining];
  return {
    currentFruit: currentFruit?.fruit,
    remaining: remaining,
    src: currentFruit.src,
  };
}
