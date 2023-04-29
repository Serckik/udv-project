import { SetCards } from "./SetCards.js"
import { quarterRequestData } from "./openCard.js"

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

let filterData = {
    block: 'Все',
    sort: '',
    planned: 'Все',
    done: 'Все',
    self: false,
    search: '',
    quarter: [quarterRequestData.current_quarter],
    current: false
}

let cards = request('GET', '/goal/get_goals', filterData)
console.log(cards)
SetCards(cards)