function doSomethingThatErrors() {
  let error = 5,
      message = "Element could not be found";
  return { error, message };
}
let {error, message} = doSomethingThatErrors();
console.log([error, message]); // 5 Element could not be found

