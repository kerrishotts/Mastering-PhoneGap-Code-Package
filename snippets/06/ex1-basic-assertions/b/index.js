let should = chai.should();              // or .expect or .assert

let code = {};
code.doSomething = function (obj) {
    obj.x = 5;
}

code.doSomethingElse = function (obj) {
    obj.x = 4;
}

let anObject = {
    x:0
}

code.doSomething(anObject);
try {
    anObject.x.should.be.equal(5);              // (1)
} catch (err) {
    console.log("1. ERROR:" + err.message);
}

code.doSomethingElse(anObject);
try {
    anObject.x.should.be.equal(5);              // (2)
} catch (err) {
    console.log("2. ERROR:" + err.message);
}


