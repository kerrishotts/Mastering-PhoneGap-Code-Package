var i = 10, x = 0;
console.log(i);                       // 10
for (var i = 0,l = 5; i < l; i++) {
  x += i;
}
console.log(x);                       // 10 (0+1+2+3+4)
console.log(i);                       // 5
console.log(l);                       // 5
