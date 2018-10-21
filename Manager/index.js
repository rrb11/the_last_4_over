module.exports = function(wagner)
{
    wagner.factory('CricketManager',function(){
        let CricketManager = require('./CricketManager');
        return new CricketManager(wagner);
    });
}
