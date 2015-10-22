function findElements({query, first = false}) {
  let els = [].slice.call(document.querySelectorAll(query));
  if (first === true) {
    els = [els[0]];
  }
  return els;
}
console.log( findElements({query: "a", first: true}).map(o=> o.textContent) );
console.log( findElements({query: "a"}).map(o=> o.textContent) );

