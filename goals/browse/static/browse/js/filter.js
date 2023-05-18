import { SetCards, SetSummaryCards } from "./SetCards.js"

export let colors = {"Оценка": "rgba(255, 81, 81, 0.44)",
              "Подбор": "rgba(255, 153, 0, 0.44)",
              "Адаптация": "rgba(119, 255, 107, 0.44)",
              "Корп. культура и бенефиты": "rgba(121, 174, 168, 1)",
              "HR-бренд внешний": "rgba(0, 178, 255, 0.44)",
              "HR-сопровождение": "rgba(219, 222, 84, 0.44)",
              "Внутренняя работа отдела": "rgba(143, 64, 206, 0.44)",
              "Кадровый учет и зп": "rgba(248, 22, 225, 0.44)",
              "Развитие персонала": "rgba(0, 0, 0, 0.44)"}

export let vectors = ["M2 13.7412H33.8687V32.1915C33.8687 33.1179 33.1178 33.8688 32.1914 33.8688H3.6773C2.75095 33.8688 2 33.1179 2 32.1915V13.7412Z",
    "M2 6.19341C2 5.26707 2.75095 4.51611 3.6773 4.51611H32.1914C33.1178 4.51611 33.8687 5.26707 33.8687 6.19341V13.7413H2V6.19341Z",
    "M11.2246 2V8.70921",
    "M24.6436 2V8.70921"]

export let quarterRequestData = request('GET','/goal/get_quarters')


export let block = 'Все'
let sort = 'Все'
let planned = 'Все'
let done = 'Все'
let self = false
let search = ''
let picked = 'Все'
export let selectedGoals = []
export let quarter = [quarterRequestData.current_quarter]
console.log(document.cookie)
CheckCoockies(document.cookie)

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

$(document).on('click', '.taked-list-element', function(e){
    $('.taked-list-element.active-sort').removeClass('active-sort')
    e.currentTarget.classList.add('active-sort')
    picked = e.currentTarget.id
    Filter()
})

export function Filter() { 
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
    for (let key in data) {
        if(key !== 'search'){
            AddCoockie(data[key], key)
        }
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
    if(self) { $('.search-checkbox').prop('checked', true); }
    quarter = cookieData.quarter.split(',')
    if(window.location.href.split('/')[4] == 'summary'){
        quarter = [quarter[quarter.length - 1]]
    }
    else{
        quarter = quarter.filter((item) => {
            return Boolean(item);
        })
    }
    if(cookieData.selectedGoals != undefined){
        selectedGoals = cookieData.selectedGoals.split(',')
        if(selectedGoals[0] === ''){
            selectedGoals = []
        }
    }
    Filter()
}

