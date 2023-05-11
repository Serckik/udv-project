import { FillForm} from "./openCard.js"

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

$('.search-checkbox-block p').text('Только выбранные')
$('.done-block').addClass('hidden');
$('.taked-block').removeClass('hidden')
$('.cvartal-select').removeAttr('multiple')

FillForm('add-summary-form')

$('.card').on('click', function(e) {
    if (e.ctrlKey) {
        if($(this).hasClass('selected')){
            $(this).removeClass('selected')
        }
        else{
            $(this).addClass('selected')
        }
    }
});

$('#add-summary-form button').on('click', function(){
    let selectedGoals = $('.selected')
    let goals = []
    if(selectedGoals.length == 0){
        return
    }
    selectedGoals.each(function (indexInArray, valueOfElement) { 
         goals.push($(this).attr('id'))
    });
    let data = {
        name: $("#add-summary-form #summary-name").val(),
        plan: $("#add-summary-form #summary-plan").val(),
        fact: $("#add-summary-form #summary-fact").val(),
        block: $("#add-summary-form #card-block").val(),
        quarter: $(".left-submenu #card-cvartal").val(),
        goals: goals,
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request('POST', '/goal/add_summary', data)
})