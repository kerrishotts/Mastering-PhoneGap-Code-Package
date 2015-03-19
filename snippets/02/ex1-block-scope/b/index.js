let i = 10, x = 0;
console.log(i);                       // 10
for (let i = 0,l = 5; i < l; i++) {
  x += i;
}
console.log(x);                       // 10 (0+1+2+3+4)
console.log(i);                       // 10
console.log(l);                       // Can't find variable: l
