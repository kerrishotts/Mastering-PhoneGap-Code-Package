let should = chai.should();

function tryIt(idx, fn) {
    try {
        fn();
        console.log("Assertion " + idx + " passed");
    } catch (err) {
        console.log("Error " + idx + ": " + err.message);
    }
}

tryIt(1, () => (1===1).should.be.true);
tryIt(2, () => (1===2).should.be.false);
tryIt(3, () => (1).should.be.ok);
tryIt(4, () => "hello".should.be.ok);
tryIt(5, () => (false).should.not.be.ok);

