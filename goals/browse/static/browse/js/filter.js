import {SetCards } from "./SetCards.js"

let block = 'Все'
let sort = ''
let planned = 'Все'
let done = 'Все'
let self = false
let search = ''
let quarter = []

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

export function SetFilterCards(approvecards) { 
    console.log(approvecards)
    filterCards = approvecards
    if(cards == null){
        notFilteredCards = approvecards
    } 
}

$(document).on('click', '.block-list-element', function(e){
    $('.block-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    block = e.currentTarget.id
    Filter()
})

$(document).on('click', '.sort-list-element', function(e){
    sort = e.currentTarget.id
    Filter()
})

$(document).on('click', '.planned-list-element', function(e){
    $('.planned-list-element.active-sort').removeClass('active-sort')
    planned = e.currentTarget.id
    e.currentTarget.classList.add('active-sort')
    Filter()
})

$('.cvartal-select option').mousedown(function () { 
    let select = $(this).val()
    if(quarter.includes(select)){
        let index = quarter.indexOf(select);
        if (index !== -1) {
            quarter.splice(index, 1);
        }
    }
    else{
        quarter.push(select)
    }
    Filter()
})

$(document).on('click', '.search-checkbox', function(e){
    self = $('.search-checkbox').is(':checked')
    Filter()
})

$(document).on('click', '.done-list-element', function(e){
    $('.done-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    done = e.currentTarget.id
    Filter()
})

$(document).on('input', '.search-input', function(e){
    search = $(this).val()
    Filter()
})

function Filter() { 
    let data = {
        block: block,
        sort: sort,
        planned: planned,
        done: done,
        self: self,
        search: search,
        quarter: quarter
    }
    console.log(data)
    let cards = request('GET', '/goal/get_goals', data)
    SetCards(cards)
}

