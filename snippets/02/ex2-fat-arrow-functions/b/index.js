[1, 2, 3].map(val => val*2)
         .forEach(val => console.log(val));

// no parameters; note the empty parentheses
console.log([1, 2, 3].map( () => 2 ));               // [2, 2, 2]

// one parameter; no parentheses required
console.log([1, 2, 3].map( val => val*2 ));          // [2, 4, 6]

// multiple parameters; parentheses required
console.log([1, 2, 3].map( (val, idx) => val*idx )); // [0, 2, 6]

// multiple statements, need return
[1, 2, 3].map((val, idx) => {console.log(val); return val*idx;});


