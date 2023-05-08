import { Filter, colors, vectors } from "./filter.js"

export function request(type, url, data){
    let dataCards = ''
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(data) { 
            if(type == 'GET'){
                dataCards = data
            }
        },
        async: false
    })
    return dataCards
}

export let cards = null

export function GetCards() { 
    Filter()
}

export function SetCards(cards){
    $(".cards").empty()
    cards.forEach(element => {
        let cardBlock = $("<div class='card'></div>")
        cardBlock.attr('id', element.id)
        cardBlock.css("border-left-color", colors[element.block] )
        let cardTop = $("<div class='card-top'></div>")
        
        if(element.name.length > 60){
            cardTop.append($("<p></p>").text(element.name.slice(0, 35) + '...'))
        }
        else{
            cardTop.append($("<p></p>").text(element.name))
        }
        let calendar = $("<div class='calendar'></div>")
        let svgCalendar = $('<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">')
        for (let index = 0; index < 4; index++) {
            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d",vectors[index]);
            path.style.strokeWidth = "3.3546px";
            path.style.strokeLinejoin = "round"
            svgCalendar.append(path)
        }
        calendar.append(svgCalendar)
        if(element.isdone){
            let done = $('<svg class="done" width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">')
            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d", "M2 7.0319L7.0319 12.0638L17.0957 2");
            path.style.strokeWidth = "3.35px";
            path.style.strokeLinejoin = "round"
            path.style.stroke = colors[element.block]
            done.append(path)
            calendar.append(done)
        }
        cardTop.append(calendar)
        cardBlock.append(cardTop)
    
        let cardBottom = $("<div class='card-bottom'></div>")
        cardBottom.append($("<p></p>").text(element.weight + '%'))
    
        let cardUser = $("<div class='card-user'></div>")
        let userName = element.owner.split(' ')
        cardUser.append($("<p></p>").text(userName[0] + ' ' + userName[1].slice(0, 1) + '.'))
        cardUser.append(`<img class="user-logo" src="/static/users/img/${element.owner_id}.png" onerror="this.src='/static/img/user-logo.jpg'">`)
    
        cardBottom.append(cardUser)
        cardBlock.append(cardBottom)
    
        $(".cards").append(cardBlock)
    });
}