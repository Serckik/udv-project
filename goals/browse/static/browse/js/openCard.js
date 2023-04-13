import { GetCards } from "./SetCards.js"
const sleepTime = 100
function sleep(ms) {
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
    let div = $(".chat-container");
    div.scrollTop(div.prop('scrollHeight'));
  });

let block = ["Оценка", "Подбор", "Адаптация", "Корп. культура и бенефиты", "HR-бренд внешний", "HR-сопровождение", "Внутренняя работа отдела", "Кадровый учет и з/п", 
"Развитие персонала"]
let category = ['Запланированная', 'Незапланированная']
let cvartal = ['1 квартал 2022', '2 квартал 2022', '3 квартал 2022', '4 квартал 2022', '1 квартал 2023', '2 квартал 2023', '3 квартал 2023', '4 квартал 2023', '1 квартал 2024']
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
let score = []
for (let index = 1; index < 201; index++) {
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
            if(type == 'GET'){
                returnData = data
            }
        },
        async: false
    })
    return returnData
}

$(document).on('click', '.blur', function(e){
    $('.blur').addClass('hidden')
    $('.card-data').addClass('hidden')
    $('.active').removeClass('active')
    $('.message-sender').val('')
    $('.edit input').removeClass('send')
    $('.edit input').removeClass('remove')
    $('.edit input').val('Сохранить')
})

function convertBool(bool){
    if(bool){
        return "True"
    }
    return "False"
}

function SetVal(id, value){
    $(id).val(value)
}

function CreateOprionBlocks(values, id){
    values.forEach(element => {
        let option = $("<option></option>").text(element)
        option.attr('value', element.split('%')[0])
        $(id).append(option);
    });
}

CreateOprionBlocks(block, '#card-block')
CreateOprionBlocks(category, '#card-category')
CreateOprionBlocks(cvartal, '#card-cvartal')
CreateOprionBlocks(score, '#card-own-grade')
CreateOprionBlocks(score, '#card-leader-grade')
CreateOprionBlocks(score, '#card-weight')
CreateOprionBlocks(answer, '#card-approve')

function FillCard(cardData) { 
    $('.edit-header .edit-user p').text(cardData.user_name)
    SetVal("#more-form #card-name", cardData.name)
    SetVal("#more-form #card-description", cardData.description)
    SetVal("#more-form #card-current-progress", cardData.current_result)
    SetVal("#more-form #card-block", cardData.block)
    SetVal("#more-form #card-category", convertBool(cardData.planned) ? 'Запланированная' : 'Незапланированная')
    SetVal("#more-form #card-cvartal", cardData.quarter)
    SetVal("#more-form #card-own-grade", cardData.mark)
    SetVal("#more-form #card-leader-grade", cardData.fact_mark)
    SetVal("#more-form #card-weight", cardData.weight)
    SetVal("#more-form #card-approve", convertBool(cardData.current) ? 'Да' : 'Нет')
}

function FillChat(chatData) {
    $('.chat-submit path').attr('fill', '#D9D9D9')
    let chatContainer = $('.chat-container')
    chatContainer.empty()
    chatData.forEach(item => {
        if($('.header-user p').text() == item.name){
            let messageContainer = $("<div class='self-message'></div>")
            let userData =  $("<div class='edit-user'></div>")
            let userName = $("<p></p>").text($('.header-user p').text())
            let userimage = $('<img class="user-logo" src="/static/img/user-logo.jpg">')
            userData.append(userName)
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
            let userName = $("<p></p>").text(item.name)
            let userimage = $('<img class="user-logo" src="/static/img/user-logo.jpg">')
            userData.append(userName)
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
}

function GetDate(str) { 
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

function OpenCard(id) {
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
}

$(document).on('click', '.card', function(e){
    e.currentTarget.classList.add('active')
    OpenCard(e.currentTarget.id)
})

$('.message-sender').on('keypress', function(event) {
    if (event.keyCode === 13 && !event.shiftKey && $('.message-sender').val() == '') {
      event.preventDefault();
    }
  });

$(document).on('click', '.chat-submit', function(e){
    let id = $('.active')[0].id
    if($('.message-sender').val() != ''){
        request('POST', '/goal/chat', {goal_id: id, message: $('.message-sender').val(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
        $('.message-sender').val('')
        $('.message-sender').height(0)
        $('.chat-container')[0].setAttribute('style', 'border-bottom:' + 33 + 'px solid #F5F5F5')
        OpenCard(id)
    }
})

$(document).on('keypress', '.message-sender', function(e){
    let id = $('.active')[0].id
    if(e.which == 13 && !e.shiftKey && $('.message-sender').val() != ''){
        request('POST', '/goal/chat', {goal_id: id, message: $('.message-sender').val(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
        e.preventDefault();
        $('.message-sender').val('')
        OpenCard(id)
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

$(document).on('input', "#more-form #card-name", function(e){
    $("#more-form #card-name").attr('style', 'border: none')
    $('.edit input').removeClass('error')
    $('.edit input').val('Сохранить')
})

$(document).on('submit','#more-form',async function(e){
    e.preventDefault();
    let id = $('.active')[0].id
    if($("#more-form #card-name").val() != '' && $('#more-form #card-description').val() != ''){
        let data = {
            goal_id: id,
            name: $("#more-form #card-name").val(),
            description: $('#more-form #card-description').val(),
            current_result: $('#more-form #card-current-progress').val(),
            block: $('#more-form #card-block').val(),
            quarter: $('#more-form #card-cvartal').val(),
            current: $('#more-form #card-approve').val() == 'Да' ? true : false,
            planned: $('#more-form #card-category').val() == 'Запланированная' ? true : false,
            weight: $('#more-form #card-weight').val(),
            mark: $('#more-form #card-own-grade').val(),
            fact_mark: $('#more-form #card-leader-grade').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request("POST", "/goal/edit", data)
        await sleep(sleepTime);
        GetCards(true)
        $('#' + id).addClass('active')
        OpenCard(id)
        $('.edit input').addClass('send')
        $('.edit input').val('✓')
    }
    else{
        if($("#more-form #card-name").val() == ''){ $("#more-form #card-name").attr('style', 'border: 1px solid red') }
        $('.edit input').addClass('error')
        $('.edit input').val('!')
    }
});

$(document).on('input', "#more-form textarea", function(e){
    $('.edit input').removeClass('send')
    $('.edit input').val('Сохранить')
})

$(document).on('change', "#more-form select", function(e){
    $('.edit input').removeClass('send')
    $('.edit input').val('Сохранить')
})