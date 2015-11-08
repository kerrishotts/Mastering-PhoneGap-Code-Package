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
    (5).should.equal(5);
});

tryIt(2, () => {
    [1].should.equal([1]);
});

tryIt(3, () => {
    [1].should.deep.equal([1]);
});

tryIt(4, () => {
    let x = 5;
    should.equal(x,5);
});

tryIt(5, () => { 
    [1,2,3].should.have.length.above(1);
    (5).should.be.above(4);
});

tryIt(6, () => { 
    [1,2,3].should.have.length.below(4);
});

tryIt(7, () => { 
    [1,2,3].should.have.length.at.least(3);
    (10).should.be.gte(5);
});

tryIt(8, () => { 
    [1,2,3].should.have.length.at.most(3);
});

tryIt(9, () => { 
    "hello".should.have.length.within(4,6);
});

tryIt(10, () => { 
    (5.75).should.be.closeTo(6, 0.5);
});

tryIt(11, () => { 
    "hello".should.match(/.*/);
});

tryIt(12, () => { 
    "hello".should.have.string("lo");
});


