import { sleep } from "./load.js"
import { CardSend, CardNameError, FormChange, CardNameChange } from "./openCard.js"
import { UpdateTaked } from "./SetCards.js"
import { selectedGoals, AddCoockie, Filter } from "./filter.js"
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
$('.block-list #Все').addClass('hidden')
$('.block-list #Все').removeClass('active-sort')

$(document).on('click', '.card', function(e) {
    if (e.ctrlKey) {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected')
            let index = selectedGoals.indexOf($(this).attr('id'));
            if (index !== -1) {
                selectedGoals.splice(index, 1);
            }
        }
        else{
            $(this).addClass('selected')
            selectedGoals.push($(this).attr('id'))
        }
        AddCoockie(selectedGoals, 'selectedGoals')
    }
    console.log(selectedGoals)
});

$('#add-summary-form button').on('click', async function(){
    if($('#add-summary-form .send').length != 0){
        return
    }
    if($("#add-summary-form #summary-name").val().trim().length != 0){
        let data = {
            name: $("#add-summary-form #summary-name").val(),
            plan: $("#add-summary-form #summary-plan").val(),
            fact: $("#add-summary-form #summary-fact").val(),
            block: $(".left-submenu .block-list .active-sort").attr('id'),
            quarter: $(".left-submenu #card-cvartal").val(),
            goals: selectedGoals,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request('POST', '/goal/add_summary', data)
        selectedGoals.length = 0
        AddCoockie(selectedGoals, 'selectedGoals')
        Filter()
        UpdateTaked()
        await sleep(sleepTime);
        CardSend('summary')
        $('#add-summary-form #summary-description').val('')
        $('#add-summary-form #summary-plan').val('')
        $('#add-summary-form #summary-fact').val('')
    }
    else{
        CardNameError('summary', 'summary-name')
    }
    $("#add-summary-form #summary-name").val('')
})

$(document).on('input', "#add-summary-form #summary-name", function(e){
    CardNameChange('summary', 'summary-name', 'добавить')
})

$(document).on('input', "#add-summary-form textarea", function(e){
    FormChange('summary', 'добавить')
})

$(document).on('change', "#add-summary-form select", function(e){
    FormChange('summary', 'добавить')
})

$(document).on('click', ".card", function(e){
    FormChange('summary', 'добавить')
})

