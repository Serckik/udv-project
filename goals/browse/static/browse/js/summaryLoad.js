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
let currentIdCard = ''
FillForm('summary-more-form')
$(document).on('click', '.summary-card', function(e) {
    currentIdCard = e.currentTarget.id
    let summaryData = request('GET', '/goal/get_summary', {summary_id: currentIdCard})
    $('.blur').removeClass('hidden');
    $('.summary-data').removeClass('hidden');
    SetVal("#summary-more-form #summary-name", summaryData.name)
    SetVal("#summary-more-form #summary-plan", summaryData.plan)
    SetVal("#summary-more-form #summary-fact", summaryData.fact)
    SetVal("#summary-more-form #card-own-grade", summaryData.average_mark)
    console.log(summaryData)
    summaryGoals = summaryData.goals
    console.log(summaryGoals)
    SetCards(summaryGoals)
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