function slowDiv( a, b ) {
  let p = new Promise((resolve,reject) => {
    setTimeout(()=>{
      if (b === 0) { reject("Can't divide by zero"); }
      else { resolve(a/b); }
    }, 2500 + (Math.random() * 10000) );
  });
  return p;
}

async function doCalculation_a() {
  try {
    let result1 = await slowDiv(10, 5);       // 2, eventually
    let result2 = await slowDiv(20, result1); // 10, eventually
    console.log(result2);
  } catch (err) {
    console.log("error", error);
  }
}

doCalculation_a();

async function doCalculation_b() {
  try {
    // 10, eventually
    console.log( await slowDiv(20, await slowDiv(10, 5)));
  } catch (err) {
    console.log("error", error);
  }
}

doCalculation_b();

