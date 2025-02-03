export function calculateScore(fruitCombo = 1) {
  const comboToNum = Number.parseInt(fruitCombo);
  let output = 0;
  switch (comboToNum) {
    case 3:
      output = 27;
      break;

    default:
      break;
  }
  return;
}
