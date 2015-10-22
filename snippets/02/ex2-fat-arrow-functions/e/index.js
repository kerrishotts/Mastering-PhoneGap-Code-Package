let o = {
  a: [1, 2, 3],
  b: 5,
  doMul() {
    return this.a.map(val => val * this.b);
  }
}

console.log(o.doMul());
