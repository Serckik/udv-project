import { SetCards } from "./SetCards.js"
import { Filter } from "./filter.js";
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
let removed = []
let currentIdCard = ''
FillForm('summary-more-form')
$(document).on('click', '.summary-card', function(e) {
    $('#summary-more-form textarea').attr('style', 'cursor:text')
    OpenSummary(e.currentTarget.id)
});

function OpenSummary(id){
    currentIdCard = id
    summaryGoals = []
    currentCards = []
    removed = []
    $('#summary-more-form textarea').attr('style', 'cursor:text')
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
}

$(document).on('click','.submenu p', async function(e){
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
            removed.push(cardId)
            let index = summaryGoals.indexOf(cardId);
            if (index !== -1) {
                summaryGoals.splice(index, 1);
            }
        }
        else if(currentCards.includes(cardId)){
            $(this).removeClass('removed')
            let index = removed.indexOf(cardId);
            if (index !== -1) {
                removed.splice(index, 1);
            }
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
    console.log(removed)
});

$(document).on('submit','#summary-more-form', async function(e){
    e.preventDefault();
    if($('#summary-more-form .send').length != 0){
        return
    }
    if($("#summary-more-form #summary-name").val() != ''){
        let data = {
            summary_id: currentIdCard,
            name: $("#summary-more-form #summary-name").val(),
            plan: $("#summary-more-form #summary-plan").val(),
            fact: $("#summary-more-form #summary-fact").val(),
            average_mark: $('#summary-more-form #card-own-grade').val(),
            goals: summaryGoals,
            removed: removed,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request('POST', '/goal/edit_summary', data)
        await sleep(sleepTime);
        Filter()
        CardSend('summary-edit')
        OpenSummary(currentIdCard)
    }
    else{
        CardNameError('summary-edit', 'summary-name')
    }
})

$(document).on('input', '.edit-summary .search-input', function(e){
    console.log('uwu')
    let search = $(this).val()
    SetCards(request('GET', '/goal/get_goals', {summary_id: currentIdCard, search: search}))
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

$(document).on('click', ".card", function(e){
    FormChange('summary-edit')
})

$('.delete-summary-icon').on('click', function(e){
    request('POST', '/goal/delete_summary', {summary_id: currentIdCard, csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    currentIdCard = null
    location.reload()
})

$(document).on('submit','#more-form', async function(e){
    e.preventDefault();
    OpenSummary(currentIdCard)
});

$(document).on('click', '.load-excel', function(e){
    window.location.href = '/goal/download_summaries?quarter=' + $('.left-submenu #card-cvartal').val();
})