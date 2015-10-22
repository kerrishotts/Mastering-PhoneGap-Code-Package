function sum(...items) {
  return items.reduce((prev, cur) => (prev + cur), 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

