import { userName, GetDate, request, sleep } from "./load.js";
import { Filter } from "./filter.js";
let timeoutID = 0
let currentIdCard = ''

$(".message-sender").each(function() {
    this.style.height = this.scrollHeight + "px";
}).on("input", function() {
    if ($('.message-sender').val() === '') {
        this.style.height = 0;
    }
    if (this.style.height.split('px')[0] < 170) {
        this.style.height = 0;
        if (this.scrollHeight > 170) {
            this.style.height = "170px";
            $('.chat-container')[0].setAttribute('style', 'border-bottom: 170px solid #F5F5F5');
        } else {
            this.style.height = this.scrollHeight + "px";
            $('.chat-container')[0].setAttribute('style', 'border-bottom:' + this.scrollHeight + 'px solid #F5F5F5');
        }
    }
});

$(document).on('click', '.blur', function(e){
    clearTimeout(timeoutID);
    if ($('.summary-data').hasClass('hidden') || $('.card-data').hasClass('hidden') || $('.summary-data').length === 0) {
        $('.card-data, .blur, .summary-data').addClass('hidden');
        $('.submenu .current-page').removeClass('current-page');
        $('.submenu p:nth-child(1)').addClass('current-page');
        $('.edit-summary').addClass('hidden');
        $('.summary-current-cards').removeClass('hidden');
    } else {
        $('.card-data').addClass('hidden');
    }
    $('.update-image').addClass('hidden');
});

export function SetVal(id, value){
    $(id).val(value)
}

function FillCard(cardData) {
    const $moreForm = $('#more-form');
    const $editHeader = $('.edit-header');
    const $editUser = $editHeader.find('.edit-user p');
    const $deleteIcon = $('.delete-icon');
    const $completeBlock = $('.complete-block');
    const $done = $completeBlock.find('.done');
    const $edit = $('.edit');
    const $error = $edit.find('.error');
    const $send = $edit.find('.send');
    const $button = $edit.find('button')
    const $inputFields = $moreForm.find('input, textarea, select');
    
    $editUser.text(cardData.user_name);
    SetVal("#more-form #card-name", cardData.name);
    SetVal("#more-form #card-description", cardData.description);
    SetVal("#more-form #card-current-progress", cardData.current_result);
    SetVal("#more-form #card-block", cardData.block);
    SetVal("#more-form #card-category", cardData.planned ? 'Запланированная' : 'Незапланированная');
    SetVal("#more-form #card-cvartal", cardData.quarter);
    SetVal("#more-form #card-own-grade", cardData.mark);
    SetVal("#more-form #card-weight", cardData.weight);
    SetVal("#more-form #card-leader-grade", cardData.fact_mark);
    SetVal("#more-form #card-approve", cardData.current ? 'Да' : 'Нет');
    
    $error.removeClass('error');
    $send.removeClass('send');
    $button.text('сохранить');
    $('.message-sender').val('');
    
    if (cardData.isdone) {
        $completeBlock.addClass('complete');
        $done.removeClass('hidden');
    } else {
        $completeBlock.removeClass('complete');
        $done.addClass('hidden');
    }
    
    $deleteIcon.addClass('hidden');
    
    if (!cardData.current) {
        $deleteIcon.removeClass('hidden');
    }
    
    $('.disabled').removeClass('disabled');
    $inputFields.removeAttr('disabled');
    $inputFields.removeAttr('style');
    
    $editHeader.find('.delete-icon').removeClass('disabled');
    $editHeader.find('.complete-block').removeClass('disabled');
    
    if (cardData.rights && !cardData.admin_rights) {
        $('.ruk-edit').addClass('disabled');
        $('.ruk-edit select').attr('disabled', 'disabled').attr('style', 'cursor:default');
    } else if (!cardData.rights && !cardData.admin_rights) {
        $moreForm.addClass('disabled');
        $deleteIcon.addClass('disabled');
        $completeBlock.addClass('disabled');
        $inputFields.attr('disabled', 'disabled').attr('style', 'cursor:default');
        $inputFields.attr('style', 'cursor:default');
        $inputFields.attr('disabled', 'disabled').attr('style', 'cursor:default; color:gray');
    }
}

function FillChat(chatData) {
    let isScrollDown = false;
    let div = $(".chat-container");

    if (Math.round(div.prop('scrollTop')) === div.prop('scrollHeight') - div.prop('clientHeight')) {
        isScrollDown = true;
    }

    if ($('.message-sender').val().length === 0) {
        $('.chat-submit path').attr('fill', '#D9D9D9');
    }

    let chatContainer = $('.chat-container');
    chatContainer.empty();

    chatData.forEach(item => {
        let messageContainer;
        let userData = $("<div class='edit-user'></div>");
        let name = $("<p></p>").text(item.name);
        let userimage = $(`<img class="user-logo" src="/static/users/img/${item.user_id}.png" onerror="this.src='/static/img/user-logo.png'">`);
        userData.append(name);
        userData.append(userimage);

        if (userName === item.name) {
            messageContainer = $("<div class='self-message'></div>");
        } else {
            messageContainer = $("<div class='sender-message'></div>");
        }

        messageContainer.append(userData);

        let message = $("<div class='message'></div>").text(item.text);
        let date = item.time.split('T');
        let time = date[1].split('.');
        message.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]));
        messageContainer.append(message);
        chatContainer.append(messageContainer);
    });

    if (isScrollDown) {
        div.scrollTop(div.prop('scrollHeight'));
    }
}

function FillHistory(historyData) {
    const $history = $('.history');
    $history.empty();

    historyData.forEach(item => {
        const historyCard = $("<div class='history-card'></div>");

        item.field_changes.forEach(change => {
            const historyContainer = $("<div class='history-container'></div>");
            const whatChange = $("<p></p>").text(`${item.name} изменил(а): `);
            whatChange.append($('<b></b>').text(change.field));

            const prevNow = $("<div class='prev-now'></div>");
            prevNow.append($("<p class='prev'></p>").text('Было: ' + change.old_data));
            prevNow.append($("<p class='now'></p>").text('Стало: ' + change.new_data));

            historyContainer.append(whatChange);
            historyContainer.append(prevNow);
            historyCard.append(historyContainer);
        });

        const date = item.time.split('T');
        const time = date[1].split('.');
        historyCard.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]));

        $history.append(historyCard);
    });
}

export function OpenCard(id) {
    currentIdCard = id;

    let data = {
        goal_id: id,
    };

    let card = request('GET', '/goal/get_goal', data);
    $('.card-data .user-logo')
        .attr('src', '/static/users/img/' + card.owner_id + '.png')
        .attr('onerror', "this.src='/static/img/user-logo.png'");

    FillCard(card);
    FillChat(card.chat);
    FillHistory(card.history);

    $('.blur').removeClass('hidden');
    $('.card-data').removeClass('hidden');
    $('.message-sender').height(0);
    $('.chat-container').css('border-bottom', '33px solid #F5F5F5');

    let chatContainer = $(".chat-container");
    chatContainer.scrollTop(chatContainer.prop('scrollHeight'));

    let historyContainer = $(".history");
    historyContainer.scrollTop(historyContainer.prop('scrollHeight'));

    executeQuery();
}

$(document).on('click', '.card', function(e){
    if(!e.ctrlKey){
        OpenCard(e.currentTarget.id)
    }
})

$('.message-sender').on('keypress', function(event) {
    if (event.keyCode === 13 && !event.shiftKey && $('.message-sender').val() == '') {
      event.preventDefault();
    }
});

$(document).on('click', '.chat-submit', function(e) {
    const messageSender = $('.message-sender');
    const currentMessage = messageSender.val();

    if (currentMessage !== '') {
        request('POST', '/goal/chat', {
            goal_id: currentIdCard,
            message: currentMessage,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        });

        messageSender.val('');
        messageSender.height(0);
        $('.chat-container').css('border-bottom', '33px solid #F5F5F5');

        const chatData = request('GET', '/goal/get_chat', {
            goal_id: currentIdCard
        });

        FillChat(chatData.chat);

        const chatContainer = $(".chat-container");
        chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
    }
});

$(document).on('keypress', '.message-sender', function(e) {
    const messageSender = $('.message-sender');
    const currentMessage = messageSender.val();

    if (e.which === 13 && !e.shiftKey && currentMessage !== '') {
        request('POST', '/goal/chat', {
            goal_id: currentIdCard,
            message: currentMessage,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        });

        e.preventDefault();
        messageSender.val('');

        const chatData = request('GET', '/goal/get_chat', {
            goal_id: currentIdCard
        });

        FillChat(chatData.chat);

        const chatContainer = $(".chat-container");
        chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
    }
});

$(document).on('input', '.message-sender', function(e){
    if($('.message-sender').val() == ''){
        $('.chat-submit path').attr('fill', '#D9D9D9')
    }
    else{
        $('.chat-submit path').attr('fill', '#F89C1D')
    }
})

$(document).on('submit', '#more-form', async function(e) {
    e.preventDefault();

    if ($('#more-form .send').length !== 0) {
        return;
    }

    const cardName = $("#more-form #card-name").val();
    
    if (cardName !== '') {
        const data = {
            goal_id: currentIdCard,
            name: cardName,
            description: $('#more-form #card-description').val(),
            current_result: $('#more-form #card-current-progress').val(),
            block: $('#more-form #card-block').val(),
            quarter: $('#more-form #card-cvartal').val(),
            current: $('#more-form #card-approve').val() === 'Да' ? 'True' : 'False',
            planned: $('#more-form #card-category').val() === 'Запланированная' ? 'True' : 'False',
            weight: $('#more-form #card-weight').val(),
            mark: $('#more-form #card-own-grade').val(),
            fact_mark: $('#more-form #card-leader-grade').val(),
            is_done: $('.edit-header .complete-block').hasClass('complete') ? 'True' : 'False',
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        };

        request('POST', '/goal/edit', data);
        await sleep();
        clearTimeout(timeoutID);
        OpenCard(currentIdCard);
        CardSend('edit');
        Filter()
    } else {
        CardNameError('edit', 'card-name');
    }
});

$(document).on('input', "#more-form #card-name", function(e) {
    CardNameChange('edit', 'card-name');
});

$(document).on('input', "#more-form textarea", function(e) {
    FormChange('edit');
});

$(document).on('change', "#more-form select", function(e) {
    FormChange('edit');
});

export function CardSend(classForm) {
    console.log(classForm);
    $('.' + classForm + ' button').addClass('send');
    $('.' + classForm + ' button').text('✓');
}

export function CardNameError(classForm, nameId) {
    $('.' + classForm + ' #' + nameId).css('border', '1px solid red');
    $('.' + classForm + ' button').addClass('error');
    $('.' + classForm + ' button').text('!');
}

export function CardNameChange(classForm, nameId, defaultValue = 'сохранить') {
    $('.' + classForm + ' #' + nameId).css('border', 'none');
    $('.' + classForm + ' button').removeClass('error');
    $('.' + classForm + ' button').text(defaultValue);
}

export function FormChange(classForm, defaultValue = 'сохранить') {
    $('.' + classForm + ' button').removeClass('send');
    if ($('.' + classForm + ' .error').length === 0) {
        $('.' + classForm + ' button').text(defaultValue);
    }
}

$('.complete-block').on('click', function(e){
    const completeIcon = $('.complete-block')
    const doneIcon = $('.edit-header .done')
    if(completeIcon.hasClass('complete')){
        completeIcon.removeClass('complete')
        doneIcon.addClass('hidden')
    }
    else{
        completeIcon.addClass('complete')
        doneIcon.removeClass('hidden')
    }
    FormChange('edit')
})

$('.delete-icon').on('click', function(e){
    request('POST', '/goal/delete_goal', {goal_id: currentIdCard, csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    currentIdCard = null
    location.reload()
})

function executeQuery() {
    $.ajax({
        type: 'GET',
        url: '/goal/get_chat',
        data: {goal_id: currentIdCard},
        success: function(data) {
            FillChat(data.chat)
        }
    });
    timeoutID = setTimeout(executeQuery, 5000);
}