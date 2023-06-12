import { OpenCard } from "./openCard.js"
import { notifications, GetDate, request, UpdateNotification, images } from "./load.js";

countNotRead()

function countNotRead(){
    let notRead = 0
    notifications.forEach(element => {
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
const readAll = document.querySelector('.read-all-notifications svg')

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
    UpdateNotification()
    countNotRead()
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
    readAll.classList.remove('active')
});

function setNotifications() {
    let notificationBlock = $('.notifications')
    notificationBlock.empty()
    notifications.forEach(element => {
        let notificationContainer = $("<div class='notification-container'></div>")
        notificationContainer.attr('id', element.goal_id + ' ' + element.id)
        let notificationData = $("<div class='notification-data'></div>")
        let text = $("<div class='notification-text'></div>")
        let goalName = element.goal_name.length > 83 ? element.goal_name.slice(0, 83) + '...' : element.goal_name
        notificationData.append($(`<img class="user-logo" src="/static/users/img/${images[element.sended_by_id]}">`))
        text.append($("<b></b>").text(element.sended_by_name))
        if(element.is_goal){
            text.append($("<span></span>").text(' изменила(а) '))
            text.append($("<span></span>").text(`[${element.comment}] задачи `))
        }
        else{
            text.append($("<span></span>").text(' оставил(а) комментарий: '))
            let comment = element.comment.length > 20 ? element.comment.slice(0, 20) + '...' : element.comment
            text.append($("<span></span>").text(`"${comment}" на задаче `))
        }
        text.append($("<b></b>").text(`"${goalName}"`))
        notificationData.append(text)
        if(!element.is_read){
            notificationData.append($("<div class='notification-circle'></div>"))
            console.log(element)
        }
        let date = element.created_at.split('T')
        notificationContainer.append(notificationData)
        notificationContainer.append($("<p class='date'></p>").text(GetDate(date[0])))
        notificationBlock.append(notificationContainer)
    });
}

readAll.addEventListener('click', () => {
    readAll.classList.add('active')
    request('POST', '/user/read_notification', {id: 'all', csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    UpdateNotification()
    countNotRead()
    setNotifications()
});
