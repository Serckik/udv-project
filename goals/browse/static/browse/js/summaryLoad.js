import { SetCards } from "./SetCards.js"
import { Filter } from "./filter.js";
import { CardSend, CardNameError, FormChange, CardNameChange, SetVal } from "./openCard.js"
import { FillForm, sleep, opacityColors, colors } from "./load.js";
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
$('.search .search-checkbox-block').remove()
$('.header-nav .summary').addClass('current-page')

let added = []
let currentCards = []
let removed = []
let currentIdCard = ''
let currentBlock = ''
FillForm('summary-more-form')
$(document).on('click', '.summary-card', function(e) {
    $('#summary-more-form textarea').attr('style', 'cursor:text')
    OpenSummary(e.currentTarget.id)
});

function OpenSummary(id){
    $('.summary-edit input').removeClass('send')
    $('.summary-edit input').removeClass('error')
    $('.summary-edit input').val('cохранить')
    currentIdCard = id
    added = []
    currentCards = []
    removed = []
    $('#summary-more-form textarea').attr('style', 'cursor:text')
    let summaryData = request('GET', '/goal/get_summary', {summary_id: currentIdCard})
    currentBlock = summaryData.block
    $('.blur').removeClass('hidden');
    $('.summary-data').removeClass('hidden');
    $('.summary-data .quarter').text(summaryData.quarter)
    SetVal("#summary-more-form #summary-name", summaryData.name)
    SetVal("#summary-more-form #summary-plan", summaryData.plan)
    SetVal("#summary-more-form #summary-fact", summaryData.fact)
    SetVal("#summary-more-form #card-own-grade", summaryData.average_mark)
    SetCards(summaryData.goals, 'current-cards')
    SetCards(request('GET', '/goal/get_goals', {summary_id: currentIdCard}))
    summaryData.goals.forEach(element => {
        currentCards.push(element.id)
    });
    $('.summary-data').attr('style', 'border-left:9px solid ' + colors[summaryData.block]);
    document.querySelector(':root').style.setProperty('--back-color', opacityColors[summaryData.block]);
    console.log(currentCards)
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
        if(currentCards.includes(cardId) && !removed.includes(cardId)){
            $(this).addClass('removed')
            removed.push(cardId)
        }
        else if(currentCards.includes(cardId) && removed.includes(cardId)){
            $(this).removeClass('removed')
            let index = removed.indexOf(cardId);
            if (index !== -1) {
                removed.splice(index, 1);
            }
        }
        else if(!currentCards.includes(cardId) && added.includes(cardId)){
            $(this).removeClass('selected')
            let index = added.indexOf(cardId);
            if (index !== -1) {
                added.splice(index, 1);
            }
        }
        else{
            $(this).addClass('selected')
            added.push(cardId)
        }
    }
    console.log(added)
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
            added: added,
            removed: removed,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request('POST', '/goal/edit_summary', data)
        await sleep(sleepTime);
        Filter()
        OpenSummary(currentIdCard)
        CardSend('summary-edit')
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

$(document).on('click', '.blur, .exit-icon svg', function(e){
    if (!$('.summary-data').hasClass('hidden') || !$('.card-data').hasClass('hidden') || !$('.summary-data').length === 0) {
        document.querySelector(':root').style.setProperty('--back-color', opacityColors[currentBlock]);
    }
});