let should = chai.should();
let expect = chai.expect;

function tryIt(idx, fn) {
    try {
        fn();
        console.log("Assertion " + idx + " passed");
    } catch (err) {
        console.log("Error " + idx + ": " + err.message);
    }
}


tryIt(1, () => {
    [1, 2].should.be.length(2);
});

tryIt(2, () => {
    "hello".should.contain("lo");
    [1, 2, 3].should.contain(2);
});

tryIt(3, () => {
    [].should.be.empty;
});

tryIt(4, () => {
    ({x:5}).should.have.property("x");
    ({x:{y:2}}).should.have.deep.property("x.y", 2);
    ({x:[1,2]}).should.have.deep.property("x[0]", 1);
});

tryIt(5, () => { 
    ({x:5}).should.have.ownProperty("x");
});

tryIt(6, () => { 
    let x = {
        aMethodName: a => a*2
    }
    x.should.respondTo("aMethodName");
});

tryIt(7, () => { 
    ({x:5,y:10}).should.contain.any.keys("a", "b", "x");
});

tryIt(8, () => { 
    ({x:5,y:10,z:20}).should.contain.all.keys("x", "y");
});

tryIt(9, () => { 
    ({x:5,y:10,z:20}).should.have.all.keys("x", "y");
});


