"use strict";

let should = require("../helpers/setup").should;
let code = require("./code.js");

let anObject = {
    x:0
}

code.doSomething(anObject);
anObject.x.should.be.equal(5);

code.doSomethingElse(anObject);
anObject.x.should.be.equal(5);
