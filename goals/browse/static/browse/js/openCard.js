import { Filter, quarterRequestData, quarter } from "./filter.js";
import { userName } from "./profile.js";
const sleepTime = 100
let timeutID = 0
let currentIdCard = ''

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(".message-sender").each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;");
  }).on("input", function () {
    if($('.message-sender').val() == ''){
        this.style.height = 0;
    }
    if(this.style.height.split('px')[0] < 170){
        this.style.height = 0;
        if(this.scrollHeight > 170){
            this.style.height = 170 + "px";
            $('.chat-container')[0].setAttribute('style', 'border-bottom:' + 170 + 'px solid #F5F5F5')
        }
        else{
            this.style.height = (this.scrollHeight) + "px";
            $('.chat-container')[0].setAttribute('style', 'border-bottom:' + this.scrollHeight + 'px solid #F5F5F5')
        }
    }
  });

let block = ["Оценка", "Подбор", "Адаптация", "Корп. культура и бенефиты", "HR-бренд внешний", "HR-сопровождение", "Внутренняя работа отдела", "Кадровый учет и з/п", 
"Развитие персонала"]
let quarters = quarterRequestData.quarters
let category = ['Запланированная', 'Незапланированная']
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
let score = []
for (let index = 0; index < 201; index += 5) {
    score.push(index + '%')
}
let answer = ['Да', 'Нет']

function request(type, url, data){
    let returnData = ''
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(data) { 
                returnData = data
            },
        async: false
    })
    return returnData
}

$(document).on('click', '.blur', function(e){
    clearTimeout(timeutID)
    $('body').css("overflow", "auto");
    $('.blur').addClass('hidden')
    $('.update-image').addClass('hidden')
    $('.card-data').addClass('hidden')
    $('.message-sender').val('')
    $('.edit input').removeClass('send')
    $('.edit input').removeClass('remove')
    $('.edit input').val('cохранить')
})

function convertBool(bool){
    if(bool){
        return true
    }
    return false
}

function SetVal(id, value){
    $(id).val(value)
}

export function CreateOptionBlocks(values, id, isCurrentOnly=false){
    if($(id).length == 0) { return }
    values.forEach(element => {
        let option = $("<option></option>").text(element)
        option.attr('value', element.split('%')[0])
        if(quarterRequestData.current_quarter.includes(element) && isCurrentOnly){
            option.attr('selected','selected')
        }
        else if(quarter.includes(element) && !isCurrentOnly){
            option.attr('selected','selected')
        }
        $(id).append(option);
    });
}
FillForm('more-form')
export function FillForm(idForm) { 
    CreateOptionBlocks(block, '#' + idForm +' #card-block')
    CreateOptionBlocks(category, '#' + idForm +' #card-category')
    CreateOptionBlocks(quarters, '#' + idForm +' #card-cvartal')
    CreateOptionBlocks(score, '#' + idForm +' #card-own-grade')
    CreateOptionBlocks(score, '#' + idForm +' #card-leader-grade')
    CreateOptionBlocks(score, '#' + idForm +' #card-weight')
    CreateOptionBlocks(answer, '#' + idForm +' #card-approve')
}

function FillCard(cardData) { 
    $('.edit-header .edit-user p').text(cardData.user_name)
    SetVal("#more-form #card-name", cardData.name)
    SetVal("#more-form #card-description", cardData.description)
    SetVal("#more-form #card-current-progress", cardData.current_result)
    SetVal("#more-form #card-block", cardData.block)
    SetVal("#more-form #card-category", convertBool(cardData.planned) ? 'Запланированная' : 'Незапланированная')
    SetVal("#more-form #card-cvartal", cardData.quarter)
    SetVal("#more-form #card-own-grade", cardData.mark)
    SetVal("#more-form #card-weight", cardData.weight)
    SetVal("#more-form #card-leader-grade", cardData.fact_mark)
    SetVal("#more-form #card-approve", convertBool(cardData.current) ? 'Да' : 'Нет')
    $('.disabled').removeClass('disabled')
    $('#more-form select').removeAttr('disabled', 'disabled')
    $('#more-form select').attr('style', 'cursor:pointer')
    $('#more-form textarea').removeAttr('disabled', 'disabled')
    $('#more-form textarea').attr('style', 'cursor:text')
    $('#more-form input[type=submit]').removeAttr('disabled', 'disabled')
    $('#more-form input[type=submit]').attr('style', 'cursor:pointer; color:#333333')
    if(cardData.rights == true && cardData.admin_rights == false){
        console.log("uwu")
        $('.ruk-edit').addClass('disabled')
        $('.ruk-edit select').attr('disabled', 'disabled')
        $('.ruk-edit select').attr('style', 'cursor:default')
    }
    else if(cardData.rights == false && cardData.admin_rights == false){
        $('#more-form').addClass('disabled')
        $('#more-form select').attr('disabled', 'disabled')
        $('#more-form select').attr('style', 'cursor:default')
        $('#more-form textarea').attr('disabled', 'disabled')
        $('#more-form textarea').attr('style', 'cursor:default')
        $('#more-form input[type=submit]').attr('disabled', 'disabled')
        $('#more-form input[type=submit]').attr('style', 'cursor:default; color:gray')
    }
}

function FillChat(chatData) {
    let isScrollDown = false
    let div = $(".chat-container");
    if(Math.round(div.prop('scrollTop')) === div.prop('scrollHeight') - div.prop('clientHeight')){
        isScrollDown = true
    }
    if($('.message-sender').val().length == 0){
        $('.chat-submit path').attr('fill', '#D9D9D9')
    }
    let chatContainer = $('.chat-container')
    chatContainer.empty()
    chatData.forEach(item => {
        if(userName == item.name){
            let messageContainer = $("<div class='self-message'></div>")
            let userData =  $("<div class='edit-user'></div>")
            let name = $("<p></p>").text(userName)
            let userimage = $('<img class="user-logo" src="/static/img/user-logo.jpg">')
            userData.append(name)
            userData.append(userimage)
            messageContainer.append(userData)
            let message = $("<div class='message'></div>").text(item.text)
            let date = item.time.split('T')
            let time = date[1].split('.')
            message.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]))
            messageContainer.append(message)
            chatContainer.append(messageContainer)
        }
        else{
            let messageContainer = $("<div class='sender-message'></div>")
            let userData =  $("<div class='edit-user'></div>")
            let name = $("<p></p>").text(item.name)
            let userimage = $('<img class="user-logo" src="/static/img/user-logo.jpg">')
            userData.append(name)
            userData.append(userimage)
            messageContainer.append(userData)
            let message = $("<div class='message'></div>").text(item.text)
            let date = item.time.split('T')
            let time = date[1].split('.')
            message.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]))
            messageContainer.append(message)
            chatContainer.append(messageContainer)
        }
    });
    if(isScrollDown){
        div.scrollTop(div.prop('scrollHeight'));
    }
}

export function GetDate(str) { 
    let dateObj = new Date(str);
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`
}

function FillHistory(historyData) { 
    $('.history').empty()
    historyData.forEach(item => {
        let historyCard = $("<div class='history-card'></div>")
        item.field_changes.forEach(change => {
            let historyContainer = $("<div class='history-container'></div>")
            let whatChange = $("<p></p>").text(`${item.name} изменил(а): `)
            whatChange.append($('<b></b>').text(change.field))
            let prevNow = $("<div class='prev-now'></div>")
            prevNow.append($("<p class='prev'></p>").text('Было: ' + change.old_data))
            prevNow.append($("<p class='now'></p>").text('Стало: ' + change.new_data))
            historyContainer.append(whatChange)
            historyContainer.append(prevNow)
            historyCard.append(historyContainer)
        })
        let date = item.time.split('T')
        let time = date[1].split('.')
        historyCard.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]))
        $('.history').append(historyCard)
    })
}

export function OpenCard(id) {
    $('body').css("overflow", "hidden");
    currentIdCard = id
    let data = {
        goal_id: id,
    } 
    let card = request('GET', '/goal/get_goal', data)
    FillCard(card)
    FillChat(card.chat)
    FillHistory(card.history)
    $('.blur').removeClass('hidden');
    $('.card-data').removeClass('hidden');
    $('.message-sender').height(0)
    $('.chat-container')[0].setAttribute('style', 'border-bottom:' + 33 + 'px solid #F5F5F5')
    let div = $(".chat-container");
    div.scrollTop(div.prop('scrollHeight'));
    div = $(".history");
    div.scrollTop(div.prop('scrollHeight'));
    executeQuery()
}

$(document).on('click', '.card', function(e){
    OpenCard(e.currentTarget.id)
})

$('.message-sender').on('keypress', function(event) {
    if (event.keyCode === 13 && !event.shiftKey && $('.message-sender').val() == '') {
      event.preventDefault();
    }
  });

$(document).on('click', '.chat-submit', function(e){
    if($('.message-sender').val() != ''){
        request('POST', '/goal/chat', {goal_id: currentIdCard, message: $('.message-sender').val(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
        $('.message-sender').val('')
        $('.message-sender').height(0)
        $('.chat-container')[0].setAttribute('style', 'border-bottom:' + 33 + 'px solid #F5F5F5')
        let data = request('GET', '/goal/get_chat', {goal_id: currentIdCard})
        FillChat(data.chat)
        let div = $(".chat-container");
        div.scrollTop(div.prop('scrollHeight'));
    }
})

$(document).on('keypress', '.message-sender', function(e){
    if(e.which == 13 && !e.shiftKey && $('.message-sender').val() != ''){
        request('POST', '/goal/chat', {goal_id: currentIdCard, message: $('.message-sender').val(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
        e.preventDefault();
        $('.message-sender').val('')
        let data = request('GET', '/goal/get_chat', {goal_id: currentIdCard})
        FillChat(data.chat)
        let div = $(".chat-container");
        div.scrollTop(div.prop('scrollHeight'));
    }
})

$(document).on('input', '.message-sender', function(e){
    if($('.message-sender').val() == ''){
        $('.chat-submit path').attr('fill', '#D9D9D9')
    }
    else{
        $('.chat-submit path').attr('fill', '#F89C1D')
    }
})

$(document).on('submit','#more-form',async function(e){
    e.preventDefault();
    if($("#more-form #card-name").val() != ''){
        let data = {
            goal_id: currentIdCard,
            name: $("#more-form #card-name").val(),
            description: $('#more-form #card-description').val(),
            current_result: $('#more-form #card-current-progress').val(),
            block: $('#more-form #card-block').val(),
            quarter: $('#more-form #card-cvartal').val(),
            current: $('#more-form #card-approve').val() == 'Да' ? 'True' : 'False',
            planned: $('#more-form #card-category').val() == 'Запланированная' ? 'True' : 'False',
            weight: $('#more-form #card-weight').val(),
            mark: $('#more-form #card-own-grade').val(),
            fact_mark: $('#more-form #card-leader-grade').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }

        let message = request("POST", "/goal/edit", data)
        if(message != 'Успешно'){
            alert(message)
        }
        await sleep(sleepTime);
        Filter()
        clearTimeout(timeutID)
        OpenCard(currentIdCard)
        CardSend('edit')
    }
    else{
        CardNameError('edit', 'card-name')
    }
});

$(document).on('input', "#more-form #card-name", function(e){
    CardNameChange('edit', 'card-name')
})

$(document).on('input', "#more-form textarea", function(e){
    FormChange('edit')
})

$(document).on('change', "#more-form select", function(e){
    FormChange('edit')
})

export function CardSend(classForm) { 
    $('.' + classForm + ' input').addClass('send')
    $('.' + classForm + ' input').val('✓')
 }

export function CardNameError(classForm, nameId) { 
    $('.' + classForm + ' #' + nameId).attr('style', 'border: 1px solid red')
    $('.' + classForm + ' input').addClass('error')
    $('.' + classForm + ' input').val('!')
}

export function CardNameChange(classForm, nameId){
    $('.' + classForm + ' #' + nameId).attr('style', 'border: none')
    $('.' + classForm + ' input').removeClass('error')
    $('.' + classForm + ' input').val('cохранить')
}

export function FormChange(classForm) { 
    $('.' + classForm + ' input').removeClass('send')
    if($('.' + classForm + ' .error').length == 0){
        $('.' + classForm + ' input').val('cохранить')
    }
 }

function executeQuery() {
    $.ajax({
        type: 'GET',
        url: '/goal/get_chat',
        data: {goal_id: currentIdCard},
        success: function(data) {
            FillChat(data.chat)
        }
    });
    timeutID = setTimeout(executeQuery, 5000);
}