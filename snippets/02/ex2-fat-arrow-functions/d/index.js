"use strict";

var o = {
  a: [1, 2, 3],
  b: 5,
  doMul: function() {
    return this.a.map(function(val) {
      return val * this.b;
    }, this);
  }
}
console.log(o.doMul());

