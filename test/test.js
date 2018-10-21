var assert = require('assert');
const CricketManager = require('../Manager/CricketManager');
const expect = require('chai').expect;
const should = require('chai').should();
const config = require('config');

describe('Cricket simulation ',function(){
    let cricketManager;
    before(function(){
        cricketManager = new CricketManager();
    });
    it('Should return pass the output object',function(){
        let output = cricketManager.outPutMessages();
        output.should.have.property('wicket_remaining');
        output.should.have.property('total_score');
        output.should.have.property('wining_score');
        output.should.have.property('wicket');
        output.should.have.property('total_over_by_ball');
        output.should.have.property('total_ball_by_played');
    });
});
