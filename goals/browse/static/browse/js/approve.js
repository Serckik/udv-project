import { SetCards } from "./SetCards.js"
import { SetFilterCards } from "./filter.js"

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

GetApproveCards()

function GetApproveCards(){
    let cards = request('GET', '/goal/get_non_approved_goals')
    SetCards(cards)
    SetFilterCards(cards)
}