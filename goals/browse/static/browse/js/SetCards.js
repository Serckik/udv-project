export let colors = {"Оценка": "rgba(255, 81, 81, 0.44)",
              "Подбор": "rgba(255, 153, 0, 0.44)",
              "Адаптация": "rgba(119, 255, 107, 0.44)",
              "Корп. культура и бенефиты": "rgba(121, 174, 168, 1)",
              "HR-бренд внешний": "rgba(0, 178, 255, 0.44)",
              "HR-сопровождение": "rgba(219, 222, 84, 0.44)",
              "Внутренняя работа отдела": "rgba(143, 64, 206, 0.44)",
              "Кадровый учет и з/п": "rgba(248, 22, 225, 0.44)",
              "Развитие персонала": "rgba(0, 0, 0, 0.44)"}

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

let vectors = ["M2 13.7412H33.8687V32.1915C33.8687 33.1179 33.1178 33.8688 32.1914 33.8688H3.6773C2.75095 33.8688 2 33.1179 2 32.1915V13.7412Z",
            "M2 6.19341C2 5.26707 2.75095 4.51611 3.6773 4.51611H32.1914C33.1178 4.51611 33.8687 5.26707 33.8687 6.19341V13.7413H2V6.19341Z",
            "M11.2246 2V8.70921",
            "M24.6436 2V8.70921"]

export let cards = null

export function GetCards() { 
    let data = {
        block: 'Все',
        sort: '',
        planned: 'Все',
        done: 'Все',
        self: false,
        search: '',
        quarter: [],
        current: true
    }
    cards = request("GET", "/goal/get_goals", data)
    SetCards(cards)
}

export function SetCards(cards){
    $(".cards").empty()
    cards.forEach(element => {
        let cardBlock = $("<div class='card'></div>")
        cardBlock.attr('id', element.id)
        cardBlock.css("border-left-color", colors[element.block] )
        let cardTop = $("<div class='card-top'></div>")
        
        if(element.name.length > 60){
            cardTop.append($("<p></p>").text(element.name.slice(0, 60) + '...'))
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
        let userName = element.owner_id.split(' ')
        cardUser.append($("<p></p>").text(userName[0] + ' ' + userName[1].slice(0, 1) + '.'))
        cardUser.append('<img class="user-logo" src="/static/img/user-logo.jpg">')
    
        cardBottom.append(cardUser)
        cardBlock.append(cardBottom)
    
        $(".cards").append(cardBlock)
    });
}