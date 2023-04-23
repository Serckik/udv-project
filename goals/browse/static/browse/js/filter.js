import { cards, SetCards } from "./SetCards.js"

let filterCards = cards
let currentSort = ''
let sortDir = ''
let currentSelect = 'Все'

$(document).on('click', '.block-list-element', function(e){
    $('.block-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    Filter('Блок', e.currentTarget.id)
})

$(document).on('click', '.sort-list-element', function(e){
    Filter('Сортировка', e.currentTarget.id)
})

$(document).on('click', '.planned-list-element', function(e){
    $('.planned-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    Filter('Категория', e.currentTarget.id)
})

$('.cvartal-select').change(function() {
    currentSelect = $(this).val()
    Filter('Готовность', currentSelect)
});

$(document).on('click', '.search-checkbox', function(e){
    Filter('Только свои', $('.search-checkbox').is(':checked'))
})

$(document).on('click', '.done-list-element', function(e){
    $('.done-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    Filter('Готовность', e.currentTarget.id)
})

function Filter(filterName, filterParameter) { 
    BlockFilter($('.block-list-element.active-sort').attr('id'))
    PlannedFilter($('.planned-list-element.active-sort').attr('id'))
    DoneFilter($('.done-list-element.active-sort').attr('id'))
    QuarterFilter(currentSelect)
    SelfFilter($('.search-checkbox').is(':checked'))
    if(filterName == 'Сортировка'){ 
        if(currentSort != '' && currentSort != filterParameter) { 
            $('#' + currentSort + ' .active-sort').removeClass('active-sort') 
            currentSort = ''
        }
        if(currentSort == ''){ 
            currentSort = filterParameter 
            $('#' + filterParameter + ' svg')[1].classList.add('active-sort')
            sortDir = 'up'
        }
        else if(sortDir == 'up') {
            $('#' + filterParameter + ' .active-sort').removeClass('active-sort')
            $('#' + filterParameter + ' svg')[0].classList.add('active-sort') 
            sortDir = 'down'
        }
        else{
            $('#' + filterParameter + ' .active-sort').removeClass('active-sort')
            sortDir = ''
            currentSort = ''
            SetCards(filterCards)
        }
    }
    if(filterName == 'Сортировка' || currentSort.length != 0 ) { SortFilter(currentSort) }
}

function BlockFilter(filterParameter){
    filterCards = []
    if(filterParameter == 'Все'){
        filterCards = cards
        SetCards(cards)
        return
    }

    cards.forEach(card => {
        if(card.block == filterParameter){
            filterCards.push(card)
        }
    });
    SetCards(filterCards)
}

function PlannedFilter(filterParameter) { 
    let cardsblock = Array.from(filterCards)
    filterCards = []
    let filter = filterParameter == 'Запланированная' ? true : false
    if(filterParameter == 'Все'){
        filterCards = cardsblock
        return
    }

    cardsblock.forEach(card => {
        if(card.planned == filter){
            filterCards.push(card)
        }
    });
    SetCards(filterCards)
}

function DoneFilter(filterParameter) { 
    let cardsblock = Array.from(filterCards)
    filterCards = []
    let filter = filterParameter == 'Выполненные' ? true : false
    if(filterParameter == 'Все'){
        filterCards = cardsblock
        return
    }

    cardsblock.forEach(card => {
        if(card.isdone == filter){
            filterCards.push(card)
        }
    });
    SetCards(filterCards)
}

function QuarterFilter(filterParameter){
    let cardsblock = Array.from(filterCards)
    filterCards = []
    if(filterParameter == 'Все'){
        filterCards = cardsblock
        return
    }

    cardsblock.forEach(card => {
        if(card.quarter == filterParameter){
            filterCards.push(card)
        }
    });
    SetCards(filterCards)
}

function SelfFilter(filterParameter){
    let cardsblock = Array.from(filterCards)
    filterCards = []
    if(filterParameter == false){
        filterCards = cardsblock
        return
    }

    cardsblock.forEach(card => {
        if(card.owner_id == $('.header-user p').text()){
            filterCards.push(card)
        }
    });
    SetCards(filterCards)
}

function SortFilter(filterParameter) {
    let sortedCards = Array.from(filterCards)
    sortedCards = SortByKey(sortedCards, filterParameter)
    if(sortDir == 'down'){ sortedCards.reverse() }
    SetCards(sortedCards)
}

function SortByKey(array, key)
{
    return array.sort(function(a, b)
    {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    });
}

