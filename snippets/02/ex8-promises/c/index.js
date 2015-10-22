function slowDiv( a, b ) {
  let p = new Promise((resolve,reject) => {
    setTimeout(()=>{
      if (b === 0) { reject("Can't divide by zero"); }
      else { resolve(a/b); }
    }, 2500 + (Math.random() * 10000) );
  });
  return p;
}
slowDiv (10, 5)
.then (result => console.log(result))
.catch (err => console.log("error", err));

slowDiv (10, 5)
.then (result => slowDiv(20, result))
.then (result => console.log(result))   // 20 / ( 10 / 5 ) = 10
.catch (err => console.log("error", err));

