const status = require('http-status');

module.exports = function(app,wagner)
{
    app.get('/api/getscore',function(req,res,next){
        try{
            wagner.get("CricketManager").getMatchScore().then(function(result){
                res.json({data:result});
            }).catch(function(error){
                res.send(status.BAD_REQUEST);
            });
        } catch (error){
            res.send(status.BAD_REQUEST);
        }
    });
}
