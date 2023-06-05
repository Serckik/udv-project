import { colors, vectors, images } from "./load.js"
import { selectedGoals } from "./filter.js";

export function SetCards(cards, classBlock = 'cards') {
    $("." + classBlock).empty();
    cards.forEach(element => {
        let cardBlock = $("<div class='card'></div>");
        cardBlock.attr('id', element.id);
        cardBlock.css("border-left-color", colors[element.block]);
        let cardTop = $("<div class='card-top'></div>");

        if (element.name.length > 45) {
            cardTop.append($("<p></p>").text(element.name.slice(0, 45) + '...'));
        } else {
            cardTop.append($("<p></p>").text(element.name));
        }

        if (window.location.href.split('/')[4] === 'summary') {
            let warning = $("<div class='warning'></div>");
            const quarter = element.quarter.split(' ');
            const year = quarter[2];
            warning.append($("<span></span>").text(quarter[0] + '/' + year[year.length - 2] + year[year.length - 1]));
            if (!element.picked) {
                warning.append($('<img src="/static/img/warn.svg">'));
            }
            cardTop.append(warning);
        } else {
            let calendar = $("<div class='calendar'></div>");
            let svgCalendar = $('<svg class="calendar-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">');
            const quarter = element.quarter.split(' ');
            const year = quarter[2];
            calendar.append($("<span></span>").text(quarter[0] + '/' + year[year.length - 2] + year[year.length - 1]));
            for (let index = 0; index < 4; index++) {
                let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                path.setAttribute("d", vectors[index]);
                path.style.strokeWidth = "3.3546px";
                path.style.strokeLinejoin = "round";
                svgCalendar.append(path);
            }
            calendar.append(svgCalendar);
            if (element.isdone) {
                let done = $('<svg class="done" width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">');
                let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                path.setAttribute("d", "M2 7.0319L7.0319 12.0638L17.0957 2");
                path.style.strokeWidth = "3.35px";
                path.style.strokeLinejoin = "round";
                path.style.stroke = colors[element.block];
                done.append(path);
                calendar.append(done);
            }
            cardTop.append(calendar);
        }
        cardBlock.append(cardTop);

        let cardBottom = $("<div class='card-bottom'></div>");
        cardBottom.append($("<p></p>").text(element.weight + '%'));

        let cardUser = $("<div class='card-user'></div>");
        if (element.owner !== '') {
            let userName = element.owner.split(' ');
            cardUser.append($("<p></p>").text(userName[0] + ' ' + userName[1].slice(0, 1) + '.'));
        }
        cardUser.append(`<img class="user-logo" src="/static/users/img/${images[element.owner_id]}">`);

        cardBottom.append(cardUser);
        cardBlock.append(cardBottom);

        $("." + classBlock).append(cardBlock);
    });

    if (window.location.href.split('/')[4] === 'summary') {
        UpdateTaked();
    }
}

export function SetSummaryCards(cards) {
    $('.summary-cards').empty();
    console.log(cards);
    cards.forEach(element => {
        let cardBlock = $("<div class='summary-card'></div>");
        cardBlock.attr('id', element.id);
        cardBlock.css("border-left-color", colors[element.block]);
        let cardTop = $("<div class='card-top'></div>");

        if (element.name.length > 91) {
            cardTop.append($("<p></p>").text(element.name.slice(0, 83) + '...'));
        } else {
            cardTop.append($("<p></p>").text(element.name));
        }
        const quarter = element.quarter.split(' ');
        const year = quarter[2];
        cardTop.append($("<span class='summary-quarter'></span>").text(quarter[0] + '/' + year[year.length - 2] + year[year.length - 1]));
        cardBlock.append(cardTop);

        let cardBottom = $("<div class='card-description'></div>");

        let block = $("<div></div>");
        block.append($("<p class='plan'></p>").text('План'));
        console.log(element);
        if (element.plan.length > 43) {
            block.append($("<p></p>").text(element.plan.slice(0, 43) + '...'));
        } else {
            block.append($("<p></p>").text(element.plan));
        }
        cardBottom.append(block);
        block = $("<div></div>");
        block.append($("<p class='fact'></p>").text('Факт'));
        if (element.fact.length > 43) {
            block.append($("<p></p>").text(element.fact.slice(0, 43) + '...'));
        } else {
            block.append($("<p></p>").text(element.fact));
        }
        cardBottom.append(block);
        cardBlock.append(cardBottom);
        block = element.block.replaceAll(' ', '');
        $(".summary-cards-block #" + block + ' .summary-cards').append(cardBlock);
    });
}

export function UpdateTaked() { 
    const card = $('.card')
    card.each(function(){
        if(selectedGoals.includes(this.id)){
            this.classList.add('selected')
        }
        else{
            this.classList.remove('selected')
        }
    })
}