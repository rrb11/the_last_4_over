
module.exports = function(app,wagner)
{
    app.get('/',function(req,res,next){
        res.render('index', { title: 'Express' });
    });
}
