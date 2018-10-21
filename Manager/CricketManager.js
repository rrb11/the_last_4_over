const _ = require('underscore');
const config = require('config');
const Promise = require('bluebird');

class CricketManager {

    constructor() {

        this.total_over = this.totalOver();
        this.total_score = 0;
        this.wining_score = 60;
        this.total_over_by_ball = 24;
        this.total_ball_by_played = 0;
        this.current_batsman_pair = [];
        this.available_batsman = [];
        this.current_batsman = 0;
        this.current_another_batsman = 1;
        this.over_ball = 0;
        this.wicket_remaining = 4;
        this.players_details = [];
    }

    generateScore(ball,player)
    {
        var that = this;
        return new Promise(function(resolve, reject){
            that.triggerBall(ball, player).then(function(result){
                resolve(result);
            }).catch(function(error){
                reject(error);
            });
        });
    }

    totalOver()
    {
        return 4;
    }

    randomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min) + min);
    }

    initializeMatch()
    {
        this.current_batsman_pair.push(0);
        this.current_batsman = 0;
        this.current_batsman_pair.push(1);
        this.available_batsman.push(2);
        this.available_batsman.push(3);
    }

    triggerBall(list, weight)
    {
        return new Promise(function(resolve,reject){
            let weighed_list = [];
            // Loop over weights
            for (var i = 0; i < weight.length; i++) {
                var multiples = weight[i] ;
                // Loop over the list of items
                for (var j = 0; j < multiples; j++) {
                    weighed_list.push(list[i]);
                }
            }
            resolve(weighed_list)
        });
    }

    getMatchScore()
    {
        var that = this;
        return new Promise(function(resolve, reject){
            let output;
            let checkWinLoss = that.checkWinOrLoss(that.total_score,that.wining_score,that.wicket_remaining,that.current_over);
            if(that.current_batsman_pair.length == 0)
            {
                that.initializeMatch();
            }
            if(that.over_ball === 6)
            {
                that.over_ball = 1;
            } else{
                that.over_ball = that.over_ball + 1;
            }
            that.total_ball_by_played = that.total_ball_by_played + 1;
            let player_probablity = that.fetchPlayerDetails(that.current_batsman);
            let balls = config.balls;

            that.generateScore(balls,player_probablity.probablity).then(function(get_score){
                let random_number = that.randomNumber(0,get_score.length - 1);
                let player_score = get_score[random_number];
                that.total_score = that.total_score + player_score;
                let summary = that.filterDetails(player_score,player_probablity);
                let checkWinLoss = that.checkWinOrLoss(that.total_score,that.wining_score,that.wicket_remaining,that.current_over);
                if(checkWinLoss === 1)
                {
                    output = that.outPutMessages(checkWinLoss);
                } else if(checkWinLoss === 2){
                    output = that.outPutMessages(checkWinLoss);
                }else{
                    output = that.outPutMessages(checkWinLoss);
                }
                output.summary = summary;
                resolve(output);
            }).catch(function(error){
                reject(error);
            })
        })
    }

    fetchPlayerDetails(key)
    {
        let metrics = config.players.lists
        let result = _.where(metrics,{key:parseInt(key)});
        return result[0];
    }

    filterDetails(score,player_probablity)
    {
        let text;
        let player_data = {};
        if(typeof this.players_details[player_probablity.key] == 'undefined')
        {
            player_data.ball = 0;
            player_data.score = 0;
            this.players_details[player_probablity.key] = player_data;
        }
        if(score === 1 || score === 3 || score === 5)
        {
            var player_1 = this.current_batsman;
            var player_2 = this.current_another_batsman;
            this.current_batsman = player_2;
            this.current_another_batsman = player_1;
            text = player_probablity.name+' scores '+score+' runs';
        } else if(score === 7 )
        {
            let new_batsman = this.available_batsman[0];
            this.current_batsman_pair = [];
            this.current_batsman_pair.push(new_batsman);
            this.current_batsman_pair.push(this.current_another_batsman);
            this.current_batsman =  new_batsman;
            this.wicket_remaining = this.wicket_remaining - 1;
            text = player_probablity.name+' outs';
        }else if(score === 0){
            text = player_probablity.name+' No runs';
        }else{
            text = player_probablity.name+' scores '+score+' runs';
        }
        this.players_details[player_probablity.key].score = this.players_details[player_probablity.key].score + score;
        this.players_details[player_probablity.key].ball = this.players_details[player_probablity.key].ball + 1;
        this.players_details[player_probablity.key].name = player_probablity.name
        return text;
    }

    checkWinOrLoss(current_score,wining_score,wicket_remaining,over_remaining)
    {
        if(wicket_remaining === 1)
        {
            return 2;
        }else{
            if(over_remaining == 0)
            {
                if(current_score >= wining_score)
                {
                    return 1;
                } else{
                    return 2;
                }
            }else{
                if(current_score >= wining_score)
                {
                    return 1;
                }else{
                    return 0;
                }
            }
        }
    }

    outPutMessages(status)
    {
        let output={};
        output.total_score = this.total_score;
        output.wining_score = this.wining_score;
        output.wicket_remaining = this.wicket_remaining;
        output.total_over_by_ball = this.total_over_by_ball;
        output.total_ball_by_played = this.total_ball_by_played;
        output.over_ball = this.over_ball;
        output.player_details = this.players_details;
        return output;
    }

    resetGame()
    {
        constructor();
        this.initializeMatch();
    }

}

module.exports = CricketManager;
