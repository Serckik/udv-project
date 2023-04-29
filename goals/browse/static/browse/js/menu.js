import { GetCards, SetCards } from "./SetCards.js"
import { CreateOptionBlocks, quarterRequestData } from "./openCard.js"


function request(type, url, data){
    let returnData = ''
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(data) { 
            if(type == 'GET'){
                returnData = data
            }
        },
        async: false
    })
    return returnData
}

CreateOptionBlocks(quarterRequestData.quarters, '#card-cvartal')

let title = $('title')[0].text
$('.' + title).addClass('current-page')

$('option').mousedown(function(e) {
    var el = e.target;
    e.preventDefault();
    $(this).prop('selected', !$(this).prop('selected'));
    var scrollTop = el.parentNode.scrollTop;
    setTimeout(() => el.parentNode.scrollTo(0, scrollTop), 0);
    return false;
});