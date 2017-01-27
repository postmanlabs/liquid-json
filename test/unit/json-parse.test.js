var expect = require('expect.js'),
    LJSON = require('../../');

describe('json.parse', function () {
    it('should parse a string', function () {
        expect(LJSON.parse('{"a":true}')).to.eql({
            a: true
        });
    });

    it('should parse a string with BOM', function () {
        expect(LJSON.parse('ï»¿{"a":true}')).to.eql({
            a: true
        });
    });

    describe('async variant', function () {
        it('should parse a string', function (done) {
            LJSON.async.parse('{"a":true}', function (err, json) {
                if (err) { return done(err); }

                expect(json).to.eql({ a: true });
                done();
            });
        });

        it('should parse a string with BOM', function (done) {
            LJSON.async.parse('ï»¿{"a":true}', function (err, json) {
                if (err) { return done(err); }

                expect(json).to.eql({ a: true });
                done();
            });
        });
    });

});
