import { request } from "./browse.js"

$(document).on('submit', '#add-form', function(e){
    e.preventDefault();
    let data = {
        name: $('#id_name').val(),
        description: $('#id_description').val(),
        block: $('#id_block').val(),
        quarter: $('#id_quarter').val(),
        planned: $('#id_planned').val(),
        weight: $('#id_weight').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request("POST", "/goal/add_goal", data)
})
