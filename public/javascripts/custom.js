var interval = null;
var total_over = 0;
$(document).ready(function(){
    $(".start-match").on("click",function(){
        $('.start-match').hide();
        interval = setInterval(startMatch,3000);
        $('#match-start').show();
    });
});

function startMatch()
{
    $.ajax({
        url:'/api/getscore',
        method:"GET",
        success: function(result){
            var checkStatus = checkWinLoss(result.data);
            var final_summary;
            if(checkStatus == 1)
            {
                final_summary = 'Bengaluru won by '+result.data.wicket_remaining+' and '+(result.data.total_over_by_ball - result.data.total_ball_by_played)+' balls remaining';
                clearInterval(interval);
                updateScore(result.data);
            } else if(checkStatus == 2)
            {
                final_summary = 'Bengaluru lost by '+(result.data.wining_score - result.data.total_score)+' runs' ;
                clearInterval(interval);
                updateScore(result.data);
            }else{
                updateScore(result.data);
            }
            if(typeof final_summary != 'undefined')
            {
                $('.match-headline').html(final_summary);

            }
        },
        error: function(error){
            console.log(error);
        }
    })
}

function checkWinLoss(data)
{
    if(data.total_over_by_ball == data.total_ball_by_played)
    {
        if(data.total_score >= data.wining_score)
        {
            return 1;
        } else {
            return 2;
        }
    } else{
        if(data.wicket_remaining == 1)
        {
            return 2;
        } else{
            if(data.total_score >= data.wining_score)
            {
                return 1;
            } else {
                return 0;
            }
        }
    }

}

function updateScore(data)
{
    if(data.total_over_by_ball)
    var ball_remaning = Math.floor(data.total_ball_by_played/6);
    if(ball_remaning == (data.total_ball_by_played/6))
    {
            ball_remaning = ball_remaning -1;
    }
    if(typeof data.summary == 'undefined')
    {
        var text = 'Bengaluru won by '+data.wicket_remaining+' and '+(data.total_over_by_ball - data.total_ball_by_played)+' balls remaining';
    } else{
        var text = ball_remaning+'.'+data.over_ball+' '+data.summary;
    }

    var li_data = '<li>'+text+'</li>';
    $('.match-startup-text').html('Bengaluru need '+data.wining_score+' runs to win');
    $('.total-score').html('Bengaluru:'+data.total_score+' runs');
    $('.total-wicket').html('Wicket remaining:'+data.wicket_remaining);
    $('.match-details ul').append(li_data);
}
