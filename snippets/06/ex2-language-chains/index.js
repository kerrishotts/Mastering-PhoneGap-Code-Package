let should = chai.should();

let x = 5;

try {
    x.should.be.equal(5);
    x.should.equal(5);
    x.should.be.be.be.be.equal(5);

    x = {
        "apple": 5
    };
    x.should.have.property("apple").which.is.equal(5);

    console.log("All assertions true!");
} catch (err) {
    console.log("Error: " + err.message);
}

