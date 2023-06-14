import { SetCards, SetSummaryCards } from "./SetCards.js"
import { currentQuarter, request } from "./load.js"

let filtersData ={
    'block': 'Все',
    'sort': 'Все',
    'planned': 'Все',
    'done': 'Все',
    'self': false,
    'staff': false,
    'search': '',
    'picked': 'Все',
    'reverseSort': false,
    'current': true,
    'quarter': [currentQuarter]
}
export let selectedGoals = []
console.log(document.cookie)
CheckCoockies(document.cookie)

$(document).on('click', '.block-list-element', function(e){
    $('.block-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    filtersData['block'] = e.currentTarget.id
    Filter()
})

$(document).on('click', '.left-submenu .cvartal-select option',function () { 
    let select = $(this).val()
    if(filtersData.quarter.includes(select)){
        let index = filtersData.quarter.indexOf(select);
        if (index !== -1) {
            filtersData.quarter.splice(index, 1);
        }
    }
    else{
        filtersData.quarter.push(select)
    }
    Filter()
})

$(document).on('change', '.left-submenu .cvartal-select',function () { 
    filtersData.quarter = [$(this).val()]
    Filter()
})

$(document).on('input', '.search-input', function(e){
    filtersData['search'] = $(this).val()
    Filter()
})

$(document).on('click', '.search-checkbox-block', function(e){
    e.currentTarget.classList.toggle('active-sort')
})

$(document).on('click', '.search-checkbox-block.filter', function(e){
    document.querySelector('.filter-container').classList.remove('hidden')
    if(filtersData.self){
        console.log('uwu')
        $('.filter-container-selector.personal span').text('Свои')
    }
    else if(filtersData.staff){
        $('.filter-container-selector.personal span').text('Сотрудники')
    }
    else{
        $('.filter-container-selector.personal span').text('Все')
    }
    $('.filter-container-selector.done span').text(filtersData.done)
    $('.filter-container-selector.planned span').text(filtersData.planned)
})

document.addEventListener('click', (e) => {
    if (e.target.closest('.filter-container') || e.target.closest('.search-checkbox-block.filter')) {
      return;
    }
    $('.filter-container').addClass('hidden')
});

$(document).on('click', '.search-checkbox-block.order', function(e){
    document.querySelector('.order-container').classList.remove('hidden')
})

document.addEventListener('click', (e) => {
    if (e.target.closest('.order-container') || e.target.closest('.search-checkbox-block.order')) {
      return;
    }
    $('.order-container').addClass('hidden')
});

$(document).on('click', '.filter-container-selector svg', function(e){
    const $parent = $(this)[0]
    const filters = {
        'personal': ['Все', 'Свои', 'Сотрудники'],
        'done': ['Все', 'Выполненные', 'Невыполненные'],
        'planned': ['Все', 'Запланированные', 'Незапланированные']
    }
    const filterParameter =  $parent.parentElement.classList[1]
    const text =  $parent.parentElement.textContent.trim()
    const delta = $(this).hasClass('right-arrow') ? 1 : -1
    const index = filters[filterParameter].indexOf(text) + delta
    const array = filters[filterParameter]
    let newText = ''
    if(index >= array.length){
        newText = array[0]
        $(`.filter-container-selector.${filterParameter} span`).text(newText)
    }
    else if(index < 0){
        newText = array[array.length - 1]
        $(`.filter-container-selector.${filterParameter} span`).text(newText)
    }
    else{
        newText = array[index]
        $(`.filter-container-selector.${filterParameter} span`).text(newText)
    }
    if(newText === 'Свои' && filterParameter === 'personal'){
        filtersData.self = true
        filtersData.staff = false
    }
    else if (newText === 'Сотрудники' && filterParameter === 'personal'){
        filtersData.staff = true
        filtersData.self = false
    }
    else if(newText === 'Все' && filterParameter === 'personal'){
        filtersData.staff = false
        filtersData.self = false
    }
    else{
        filtersData[filterParameter] = newText
    }
    Filter()
})

$(document).on('click', '.order-container-element', function(e){
    const filterParameter = e.currentTarget.classList[1]
    const arrow1 = e.currentTarget.querySelector('.arrows svg:nth-child(1)').classList
    const arrow2 = e.currentTarget.querySelector('.arrows svg:nth-child(2)').classList
    if(filtersData.sort != filterParameter){
        $('.order-container-element .arrows svg').removeClass('active-sort')
        filtersData.reverseSort = false
    }
    if(filterParameter === 'owner_id'){
        filtersData.sort = 'owner_id'
    }
    else{
        filtersData.sort = 'weight'
    }
    if(arrow1.value === 'active-sort'){
        arrow1.remove('active-sort')
        arrow2.add('active-sort')
        filtersData.reverseSort = true
    }
    else if(arrow2.value === 'active-sort'){
        arrow2.remove('active-sort')
        filtersData.reverseSort = false
        filtersData.sort = 'Все'
    }
    else{
        arrow1.add('active-sort')
    }
    Filter()
})


export function Filter() { 
    filtersData.block = filtersData.block.replaceAll('\\', '')
    filtersData.picked = filtersData.picked.replaceAll('\\', '')
    if(filtersData.staff === true){
        filtersData.approve = true
    }
    for (let key in filtersData) {
        if(key !== 'search'){
            AddCoockie(filtersData[key], key)
        }
        AddCoockie(filtersData.staff, 'staff')
    }
    if(window.location.href.split('/')[4] == 'add'){
        filtersData.current = false
        filtersData.self = true
    }
    if(window.location.href.split('/')[4] == 'approve'){
        filtersData.approve = true
        filtersData.current = false
    }
    if(window.location.href.split('/')[4] != 'summary'){
        filtersData.picked = 'Все'
    }
    else{
        filtersData.self = false
        if(filtersData.block === 'Все'){
            filtersData.block = 'Оценка'
            $('.block-list #Оценка').addClass('active-sort')
        }
    }
    if(window.location.href.split('/')[4] != 'browse_summary'){
        let cards = request('GET', '/goal/get_goals', filtersData)
        if(filtersData.reverseSort){
            cards.reverse()
        }
        SetCards(cards)
    }
    else if($('.edit-summary').hasClass('hidden')){
        let summaryCards = request('GET', '/goal/get_summaries', {quarter: filtersData.quarter[0], block: filtersData.block, search: filtersData.search})
        SetSummaryCards(summaryCards)
    }
    if(window.location.href.split('/')[4] == 'summary'){
        const card = $('.card')
        if(filtersData.self){
            card.each(function(){
                if(!this.classList.contains('selected')){
                    this.classList.add('hidden')
                }
            })
        }
        else{
            card.each(function(){
                this.classList.remove('hidden')
            })
        }
    }
}

export function AddCoockie(username, nameCookie) { 
    let encodedUsername = encodeURIComponent(username)
    document.cookie = `${nameCookie}=${encodedUsername}`
}

function CheckCoockies(cookieString){
    let cookieArray = cookieString.split(';');
    let cookieData = {};
    
    cookieArray.forEach(function(cookie) {
      let parts = cookie.split('=');
      let name = decodeURIComponent(parts[0].trim());
      let value = decodeURIComponent(parts[1].trim());
      console.log(value)
      if(name != 'csrftoken'){
        cookieData[name] = value;
      }
    });
    if (Object.keys(cookieData).length === 0) {
        Filter()
        return
    }
    filtersData.block = cookieData.block.replace(/[ ./]/g, "\\$&")
    $('.block-list-element.active-sort').removeClass('active-sort')
    $('.block-list-element#' + filtersData.block).addClass('active-sort')
    filtersData.sort = cookieData.sort
    filtersData.reverseSort = JSON.parse(cookieData.reverseSort)
    if(filtersData.sort === 'owner_id' && filtersData.reverseSort){
       document.querySelector('.order-container-element.owner_id .arrows svg:nth-child(2)').classList.add('active-sort')
    }
    else if(filtersData.sort === 'owner_id' && !filtersData.reverseSort){
        document.querySelector('.order-container-element.owner_id .arrows svg:nth-child(1)').classList.add('active-sort')
    }
    else if(filtersData.sort === 'weight' && filtersData.reverseSort){
        document.querySelector('.order-container-element.weight .arrows svg:nth-child(2)').classList.add('active-sort')
    }
    else if(filtersData.sort === 'weight' && !filtersData.reverseSort){
        document.querySelector('.order-container-element.weight .arrows svg:nth-child(1)').classList.add('active-sort')
    }
    filtersData.self = JSON.parse(cookieData.self)
    filtersData.staff = JSON.parse(cookieData.staff)
    filtersData.planned = cookieData.planned
    $('.filter-container-selector.personal span').text(filtersData.planned)
    filtersData.done = cookieData.done
    $('.done-list-element.active-sort').removeClass('active-sort')
    $('.done-list-element#' + cookieData.done).addClass('active-sort')
    filtersData.self = JSON.parse(cookieData.self)
    if(cookieData.picked != undefined){
        filtersData.picked = cookieData.picked.replace(/[ ./]/g, "\\$&")
    }
    $('.taked-list-element.active-sort').removeClass('active-sort')
    $('.taked-list-element#' + filtersData.picked).addClass('active-sort')
    filtersData.quarter = cookieData.quarter.split(',')
    if(window.location.href.split('/')[4] == 'summary'){
        if(filtersData.quarter[0] === ''){
            filtersData.quarter = [currentQuarter]
        }
        else{
            filtersData.quarter = [filtersData.quarter[filtersData.quarter.length - 1]]
        }
    }
    else{
        filtersData.quarter = filtersData.quarter.filter((item) => {
            return Boolean(item);
        })
    }
    $('.left-submenu #card-cvartal').each(function() {
        $(this).find("option").each(function() {
            if(filtersData.quarter.includes($(this).val())){
                $(this).prop("selected", true);
            }
            else{
                $(this).prop("selected", false);
            }
        });
    });
    if(cookieData.selectedGoals != undefined){
        selectedGoals = cookieData.selectedGoals.split(',')
        if(selectedGoals[0] === ''){
            selectedGoals = []
        }
    }
    Filter()
}

