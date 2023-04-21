import { request } from "./browse.js"
import { GetCards } from "./SetCards.js"

$(document).on('submit', '#add-form', async function(e){
    e.preventDefault();
    let data = {
        name: $('#add-form #card-name').val(),
        description: $('#add-form #card-description').val(),
        block: $('#add-form #card-block').val(),
        quarter: $('#add-form #card-cvartal').val(),
        planned: $('#add-form #card-category').val() == 'Запланированная' ? 'True' : 'False',
        weight: $('#add-form #card-weight').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    console.log(data)
    request("POST", "/goal/add_goal", data)
    GetCards(false)
})

GetCards(false)
