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

setNotifications()

const ringbell = document.querySelector('.ringbell');
const profileBlock = document.querySelector('.notification-block');

ringbell.addEventListener('click', () => {
    if (profileBlock.classList.contains('hidden')) {
        profileBlock.classList.remove('hidden');
    }
    else{
        console.log('wuwu')
        profileBlock.classList.add('hidden');
    }
});
let openCard = false
$(document).on('click', '.notification-container', function(e){
    let id = e.currentTarget.id.split(' ')
    console.log(id)
    OpenCard(id[0])
    request('POST', '/user/read_notification', {id: id[1], csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    data = request('GET', '/user/get_notifications')
    countNotRead(data)
    openCard = true
    setNotifications()
})

document.addEventListener('click', (e) => {
    if (e.target.closest('.notification-block') || e.target.closest('.ringbell') || e.target.closest('.blur') || e.target.closest('.card-data')) {
      return;
    }
    if(openCard){
        openCard = false
        return
    }
    $('.notification-block').addClass('hidden')
});

function setNotifications() {
    let notificationBlock = $('.notification-block')
    notificationBlock.empty()
    data.forEach(element => {
        let notificationContainer = $("<div class='notification-container'></div>")
        notificationContainer.attr('id', element.goal_id + ' ' + element.id)
        if(!element.is_read){
            notificationContainer.append($("<div class='notification-circle'></div>"))
        }
        let text = ''
        let goalName = element.goal_name.length > 83 ? element.goal_name.slice(0, 83) + '...' : element.goal_name
        if(element.is_goal){
            text = $("<p></p>").text('Задача "')
            text.append($("<b></b>").text(goalName))
            text.append( $("<span></span>").text('" была изменена'))
        }
        else{
            text = $("<p></p>").text('Задача "')
            text.append($("<b></b>").text(goalName))
            text.append( $("<span></span>").text('" получила новый комментарий'))
        }
        notificationContainer.append(text)
        let date = element.created_at.split('T')
        let time = date[1].split('.')
        notificationContainer.append($("<p class='date'></p>").text(GetDate(date[0]) + ' ' + time[0]))
        notificationBlock.append(notificationContainer)
    });
}
