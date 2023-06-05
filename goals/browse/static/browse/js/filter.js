import { SetCards, SetSummaryCards } from "./SetCards.js"
import { currentQuarter, request } from "./load.js"

let block = 'Все'
let sort = 'Все'
let planned = 'Все'
let done = 'Все'
let self = false
let staff = false
let search = ''
let picked = 'Все'
export let selectedGoals = []
let quarter = [currentQuarter]
console.log(document.cookie)
CheckCoockies(document.cookie)

$(document).on('click', '.block-list-element', function(e){
    $('.block-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    block = e.currentTarget.id
    Filter()
})

$(document).on('click', '.sort-list-element', function(e){
    $('.sort-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    sort = e.currentTarget.id
    Filter()
})

$(document).on('click', '.planned-list-element', function(e){
    $('.planned-list-element.active-sort').removeClass('active-sort')
    planned = e.currentTarget.id
    e.currentTarget.classList.add('active-sort')
    Filter()
})

$(document).on('click', '.left-submenu .cvartal-select option',function () { 
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

$(document).on('change', '.left-submenu .cvartal-select',function () { 
    quarter = [$(this).val()]
    Filter()
})

$(document).on('click', '.search-checkbox', function(e){
    if($(this).val() === 'свои'){
        self = $(this).is(':checked')
    }
    if($(this).val() === 'сотрудников'){
        staff = $(this).is(':checked')
    }
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

$(document).on('click', '.taked-list-element', function(e){
    $('.taked-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    picked = e.currentTarget.id
    Filter()
})

export function Filter() { 
    console.log('uwu')
    block = block.replaceAll('\\', '')
    picked = picked.replaceAll('\\', '')
    let data = {
        block: block,
        sort: sort,
        planned: planned,
        done: done,
        self: self,
        search: search,
        quarter: quarter,
        current: true,
        approve: false,
        picked: picked
    }
    if(staff === true){
        data.approve = true
    }
    for (let key in data) {
        if(key !== 'search'){
            AddCoockie(data[key], key)
        }
        AddCoockie(staff, 'staff')
    }
    if($('.search-checkbox-block .staff').length === 0){
        data.approve = false
    }
    if(window.location.href.split('/')[4] == 'add'){
        data.current = false
        data.self = true
    }
    if(window.location.href.split('/')[4] == 'approve'){
        data.approve = true
        data.current = false
    }
    if(window.location.href.split('/')[4] != 'summary'){
        data.picked = 'Все'
    }
    else{
        data.self = false
        console.log(data.quarter)
        if(data.block === 'Все'){
            data.block = 'Оценка'
            $('.block-list #Оценка').addClass('active-sort')
        }
    }
    if(window.location.href.split('/')[4] != 'browse_summary'){
        let cards = request('GET', '/goal/get_goals', data)
        SetCards(cards)
    }
    else if($('.edit-summary').hasClass('hidden')){
        let summaryCards = request('GET', '/goal/get_summaries', {quarter: quarter[0], block: block, search: search})
        SetSummaryCards(summaryCards)
    }
    if(window.location.href.split('/')[4] == 'summary'){
        const card = $('.card')
        console.log(self)
        if(self){
            console.log(self)
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
    block = cookieData.block.replace(/[ ./]/g, "\\$&")
    $('.block-list-element.active-sort').removeClass('active-sort')
    $('.block-list-element#' + block).addClass('active-sort')
    sort = cookieData.sort
    $('.sort-list-element.active-sort').removeClass('active-sort')
    $('.sort-list-element#' + cookieData.sort).addClass('active-sort')
    planned = cookieData.planned
    $('.planned-list-element.active-sort').removeClass('active-sort')
    $('.planned-list-element#' + cookieData.planned).addClass('active-sort')
    done = cookieData.done
    $('.done-list-element.active-sort').removeClass('active-sort')
    $('.done-list-element#' + cookieData.done).addClass('active-sort')
    self = JSON.parse(cookieData.self)
    console.log(self)
    if(cookieData.picked != undefined){
        picked = cookieData.picked.replace(/[ ./]/g, "\\$&")
    }
    $('.taked-list-element.active-sort').removeClass('active-sort')
    $('.taked-list-element#' + picked).addClass('active-sort')
    staff = JSON.parse(cookieData.staff)
    if(self) { $('.search-checkbox.self').prop('checked', true); }
    if(staff) { $('.search-checkbox.staff').prop('checked', true); }
    quarter = cookieData.quarter.split(',')
    if(window.location.href.split('/')[4] == 'summary'){
        console.log(quarter)
        if(quarter[0] === ''){
            quarter = [currentQuarter]
        }
        else{
            quarter = [quarter[quarter.length - 1]]
        }
    }
    else{
        quarter = quarter.filter((item) => {
            return Boolean(item);
        })
    }
    $('.left-submenu #card-cvartal').each(function() {
        $(this).find("option").each(function() {
            if(quarter.includes($(this).val())){
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

