// from  https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers/setup.js
var wd = require("wd");

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

exports.should = should;
