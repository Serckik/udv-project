import { GetDate, OpenCard } from "./openCard.js"
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

let data = request('GET', '/user/get_notifications')

countNotRead(data)

function countNotRead(data){
    let notRead = 0
    data.forEach(element => {
        if(!element.is_read) { notRead++ }
    });
    if(notRead != 0){
        $('.ringbell .active').removeClass('hidden')
        if(notRead > 9){
            $('.ringbell .active').text('9+')
        }
        else{
            $('.ringbell .active').text(notRead)
        }
    }
    else{
        $('.ringbell .active').addClass('hidden')
    }
}

$(document).on('click', '.ringbell', function(e){
    $('.notification-block').empty()
    if( $('.notification-block.hidden').length != 0){
        $('.notification-block').removeClass('hidden')
    }
    else{
        $('.notification-block').addClass('hidden')
    }
    setNotifications()
})

function setNotifications() {
    let notificationBlock = $('.notification-block')
    data.forEach(element => {
        let notificationContainer = $("<div class='notification-container'></div>")
        notificationContainer.attr('id', element.goal_id + ' ' + element.id)
        if(!element.is_read){
            notificationContainer.append($("<div class='notification-circle'></div>"))
        }
        let text = ''
        if(element.is_goal){
            text = $("<p></p>").text('Задача "')
            text.append($("<b></b>").text(element.goal_name))
            text.append( $("<span></span>").text('" была изменена'))
        }
        else{
            text = $("<p></p>").text('Задача "')
            text.append($("<b></b>").text(element.goal_name))
            text.append( $("<span></span>").text('" получила новый комментарий'))
        }
        notificationContainer.append(text)
        let date = element.created_at.split('T')
        let time = date[1].split('.')
        notificationContainer.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]))
        notificationBlock.append(notificationContainer)
    });
}


let ringbellClicked = false
$(document).on('click', 'main, header, .ringbell', function(e){
    if(e.currentTarget.classList[0] == 'ringbell'){
        console.log('uwu')
        ringbellClicked = true
        return
    }
    
    if(ringbellClicked){
        ringbellClicked = false
        return
    }

    if($('.notification-block.hidden').length == 0){
        $('.notification-block').addClass('hidden')
    }
})



$(document).on('click', '.notification-container', function(e){
    let id = e.currentTarget.id.split(' ')
    e.currentTarget.classList.add('active')
    console.log(id)
    OpenCard(id[0])
    request('POST', '/user/read_notification', {id: id[1], csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    data = request('GET', '/user/get_notifications')
    countNotRead(data)
    setNotifications()
})
