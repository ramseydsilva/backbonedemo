'use strict';

var fs = require("fs"),
    should = require("should");

describe('App structure', function() {

    it('contains app folder if in development', function() {
        fs.existsSync('./app').should.be.ok;
    });
});
