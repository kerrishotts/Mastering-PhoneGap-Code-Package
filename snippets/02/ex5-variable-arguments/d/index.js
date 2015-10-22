function interpolate ( str, ...items ) {
  return items.reduce( (prev, cur, idx) =>
      prev.replace(new RegExp(":" + (idx+1), "g"), cur), str);
}

console.log(interpolate("My name is :1 and I say :2", "Bob", "Hello"));
// My name is Bob and I say Hello

console.log(interpolate("My name is :1 and I say :2", ...["Bob", "Hello"]));

