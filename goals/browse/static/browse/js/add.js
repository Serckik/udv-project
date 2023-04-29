import { SetCards } from "./SetCards.js"
import { CardSend, CardNameError, FormChange, CardNameChange, sleep, FillForm  } from "./openCard.js"
import { quarterRequestData } from "./openCard.js"

const sleepTime = 100

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
    self: true,
    search: '',
    quarter: [quarterRequestData.current_quarter],
    current: false
}

FillForm('add-form')

$(document).on('submit', '#add-form', async function(e){
    e.preventDefault();
    if($("#add-form #card-name").val() != ''){
        let data = {
            name: $('#add-form #card-name').val(),
            description: $('#add-form #card-description').val(),
            block: $('#add-form #card-block').val(),
            quarter: $('#add-form #card-cvartal').val(),
            planned: $('#add-form #card-category').val() == 'Запланированная' ? 'True' : 'False',
            weight: $('#add-form #card-weight').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request("POST", "/goal/add_goal", data)
        await sleep(sleepTime);
        let cards = request('GET', '/goal/get_goals', filterData)
        SetCards(cards)
        CardSend('add')
    }
    else{
        CardNameError('add', 'card-name')
    }
})

$(document).on('input', "#add-form #card-name", function(e){
    CardNameChange('add', 'card-name')
})

$(document).on('input', "#add-form textarea", function(e){
    FormChange('add')
})

$(document).on('change', "#add-form select", function(e){
    FormChange('add')
})

let cards = request('GET', '/goal/get_goals', filterData)
SetCards(cards)
