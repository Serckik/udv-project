let block = ["Оценка", "Подбор", "Адаптация", "Корп. культура и бенефиты", "HR-бренд внешний", "HR-сопровождение", "Внутренняя работа отдела", "Кадровый учет и з/п", 
"Развитие персонала"]
let category = ['Запланированная', 'Незапланированная']
let cvartal = ['1 квартал 2023', '2 квартал 2023', '3 квартал 2023', '4 квартал 2023', '1 квартал 2024']
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
    $('.blur').addClass('hidden');
    $('.card-data').addClass('hidden');
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
        option.attr('value', element)
        $(id).append(option);
    });
}

function FillCard(cardData) { 
    $('.edit-header .edit-user p').text(cardData.user_name)
    SetVal("#more-form #card-name", cardData.name)
    SetVal("#more-form #card-description", cardData.description)
    SetVal("#more-form #card-current-progress", cardData.current_result)
    CreateOprionBlocks(block, '#card-block')
    SetVal("#more-form #card-block", cardData.block)
    CreateOprionBlocks(category, '#card-category')
    SetVal("#more-form #card-category", convertBool(cardData.planned) ? 'Запланированная' : 'Незапланированная')
    CreateOprionBlocks(cvartal, '#card-cvartal')
    SetVal("#more-form #card-cvartal", cardData.quarter)
    CreateOprionBlocks(score, '#card-own-grade')
    SetVal("#more-form #card-own-grade", cardData.mark + '%')
    CreateOprionBlocks(score, '#card-leader-grade')
    SetVal("#more-form #card-leader-grade", cardData.fact_mark + '%')
    CreateOprionBlocks(score, '#weight')
    SetVal("#more-form #weight", cardData.weight + '%')
    CreateOprionBlocks(answer, '#card-approve')
    SetVal("#more-form #card-approve", convertBool(cardData.current) ? 'Да' : 'Нет')
}

function FillChat(chatData, nameOwner) {
    $('.chat-submit path').attr('fill', '#D9D9D9')
    let chatContainer = $('.chat-container')
    chatContainer.empty()
    chatData.forEach(item => {
        if(nameOwner == item.name){
            let messageContainer = $("<div class='self-message'></div>")
            let userData =  $("<div class='edit-user'></div>")
            let userName = $("<p></p>").text(nameOwner)
            let userimage = $('<img class="user-logo" src="/static/img/user-logo.jpg">')
            userData.append(userName)
            userData.append(userimage)
            messageContainer.append(userData)
            let message = $("<div class='message'></div>").text(item.text)
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
            messageContainer.append(message)
            chatContainer.append(messageContainer)
        }
    });
}

$(document).on('click', '.card', function(e){
    let data = {
        goal_id: e.currentTarget.id,
    }
    let id = e.currentTarget.id
    let card = request('GET', '/goal/get_goal', data)
    console.log(card)
    $('.blur').removeClass('hidden');
    $('.card-data').removeClass('hidden');
    FillCard(card)
    FillChat(card.chat, card.user_name)

    $(document).on('click', '.chat-submit', function(e){
        if($('.message-sender').val() != ''){
            request('POST', '/goal/chat', {goal_id: id, message: $('.message-sender').val(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
        }
    })

    $(document).on('keyup', '.message-sender', function(e){
        if($('.message-sender').val() == ''){
            $('.chat-submit path').attr('fill', '#D9D9D9')
        }
        else{
            $('.chat-submit path').attr('fill', '#F89C1D')
        }
    })
})