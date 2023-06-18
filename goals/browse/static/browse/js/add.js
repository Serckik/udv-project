import { FillForm, sleep, currentQuarter, colors, opacityColors } from "./load.js"
import { CardSend, CardNameError, FormChange, CardNameChange  } from "./openCard.js"
import { Filter } from "./filter.js"

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

FillForm('add-form')
$('.filter-container-element:nth-child(1)').remove();
$('.filter-container-element:nth-child(1)').remove();
$('.order-container-element.owner_id').remove();
$('#add-form').attr('style', 'border-left:9px solid ' + colors['Оценка']);
document.querySelector(':root').style.setProperty('--back-color', opacityColors['Оценка']);

$(document).on('submit', '#add-form', async function(e){
    e.preventDefault();
    if($('#add-form .send').length != 0){
        return
    }
    if($("#add-form #card-name").val().trim().length != 0){
        let data = {
            name: $('#add-form #card-name').val(),
            description: $('#add-form #card-description').val(),
            block: $('#add-form #card-block').val(),
            quarter: $('#add-form #card-cvartal').val(),
            planned: $('#add-form #card-category').val() == 'Запланированная' ? 'True' : 'False',
            weight: $('#add-form #card-weight').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        }
        request("POST", "/goal/add_goal", data)
        await sleep(sleepTime);
        Filter()
        CardSend('add-container')
        $('#add-form #card-description').val('')
        $('#add-form #card-block').val('Оценка')
        $('#add-form #card-cvartal').val(currentQuarter)
        $('#add-form #card-category').val('Запланированная')
        $('#add-form #card-weight').val('0')
        $('#add-form').attr('style', 'border-left:9px solid ' + colors['Оценка']);
        document.querySelector(':root').style.setProperty('--back-color', opacityColors['Оценка']);
    }
    else{
        CardNameError('add-container', 'card-name')
    }
    $("#add-form #card-name").val('')
})

$(document).on('input', "#add-form #card-name", function(e){
    CardNameChange('add-container', 'card-name', 'добавить')
})

$(document).on('input', "#add-form textarea", function(e){
    FormChange('add-container', 'Добавить')
})

$(document).on('change', "#add-form select", function(e){
    FormChange('add-container', 'добавить')
})

$(document).on('change', "#add-form #card-block", function (e) { 
    const block = $(this).val()
    $('#add-form').attr('style', 'border-left:9px solid ' + colors[block]);
    document.querySelector(':root').style.setProperty('--back-color', opacityColors[block]);
 })

 $(document).on('click', '.blur, .exit-icon svg', function(e){
    const block = $('#add-form #card-block').val()
    document.querySelector(':root').style.setProperty('--back-color', opacityColors[block]);
});
