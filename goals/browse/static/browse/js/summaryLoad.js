import { SetCards } from "./SetCards.js"
import { FillForm, CardSend, CardNameError, FormChange, CardNameChange, sleep, SetVal } from "./openCard.js"
const sleepTime = 100
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

$('.cvartal-select').removeAttr('multiple')
$('.left-submenu .planned-block').addClass('hidden')
$('.left-submenu .sort-block').addClass('hidden')
$('.left-submenu .done-block').addClass('hidden')
$('.search .search-checkbox-block').addClass('hidden')
$('.header-nav .summary').addClass('current-page')

let summaryGoals = []
let currentCards = []
let currentIdCard = ''
FillForm('summary-more-form')
$(document).on('click', '.summary-card', function(e) {
    $('#summary-more-form textarea').attr('style', 'cursor:text')
    currentIdCard = e.currentTarget.id
    let summaryData = request('GET', '/goal/get_summary', {summary_id: currentIdCard})
    $('.blur').removeClass('hidden');
    $('.summary-data').removeClass('hidden');
    SetVal("#summary-more-form #summary-name", summaryData.name)
    SetVal("#summary-more-form #summary-plan", summaryData.plan)
    SetVal("#summary-more-form #summary-fact", summaryData.fact)
    SetVal("#summary-more-form #card-own-grade", summaryData.average_mark)
    SetCards(summaryData.goals, 'current-cards')
    SetCards(request('GET', '/goal/get_goals', {summary_id: currentIdCard}))
    summaryData.goals.forEach(element => {
        summaryGoals.push(element.id)
    });
    currentCards = [...summaryGoals]
    console.log(summaryGoals)
});

$(document).on('click','.submenu span', async function(e){
    $('.submenu .current-page').removeClass('current-page')
    $(this).addClass('current-page')
    if($('.edit-summary').hasClass('hidden')){
        $('.edit-summary').removeClass('hidden')
        $('.summary-current-cards').addClass('hidden')
    }
    else{
        $('.edit-summary').addClass('hidden')
        $('.summary-current-cards').removeClass('hidden')
    }
})


$(document).on('click', '.edit-summary .card', function(e) {
    const cardId = Number($(this).attr('id'))
    if (e.ctrlKey) {
        if(currentCards.includes(cardId) && summaryGoals.includes(cardId)){
            $(this).addClass('removed')
            let index = summaryGoals.indexOf(cardId);
            if (index !== -1) {
                summaryGoals.splice(index, 1);
            }
        }
        else if(currentCards.includes(cardId)){
            $(this).removeClass('removed')
            summaryGoals.push(cardId)
        }
        else if(!currentCards.includes(cardId) && summaryGoals.includes(cardId)){
            $(this).removeClass('selected')
            let index = summaryGoals.indexOf(cardId);
            if (index !== -1) {
                summaryGoals.splice(index, 1);
            }
        }
        else{
            $(this).addClass('selected')
            summaryGoals.push(cardId)
        }
    }
    console.log(summaryGoals)
    console.log(currentCards)
});

$(document).on('submit','#summary-more-form', async function(e){
    e.preventDefault();
    if($("#summary-more-form #summary-name").val() != ''){
        let data = {
            summary_id: currentIdCard,
            name: $("#summary-more-form #summary-name").val(),
            plan: $("#summary-more-form #summary-plan").val(),
            fact: $("#summary-more-form #summary-fact").val(),
            average_mark: $('#summary-more-form #card-own-grade').val(),
            goals: summaryGoals,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request('POST', '/goal/edit_summary', data)
        await sleep(sleepTime);
        CardSend('summary-edit')
        summaryGoals = []
        currentCards = []
    }
    else{
        CardNameError('summary-edit', 'summary-name')
    }
})

$(document).on('input', "#summary-more-form #summary-name", function(e){
    CardNameChange('summary-edit', 'summary-name')
})

$(document).on('input', "#summary-more-form textarea", function(e){
    FormChange('summary-edit')
})

$(document).on('change', "#summary-more-form select", function(e){
    FormChange('summary-edit')
})