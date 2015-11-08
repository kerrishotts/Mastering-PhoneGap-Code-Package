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
    let x = null;
    expect(x).to.be.null;
});

tryIt(2, () => {
    let x = "hi";
    expect(x).to.not.be.null;
});

tryIt(3, () => {
    let x;
    expect(x).to.be.undefined;
});

tryIt(4, () => {
    let x=5; 
    should.exist(x);
    expect(x).to.exist;
});

tryIt(5, () => { 
    let x = "hello";
    should.exist(x); // make sure x exists first!
    x.should.be.a("string"); 
});


