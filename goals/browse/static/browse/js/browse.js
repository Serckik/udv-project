export const sleepTime = 100
function convertBool(bool){
    if(bool){
        return "True"
    }
    return "False"
}

function SetVal(id, value){
    $(id).val(value)
}

function SetHistory(historyName, className, values){
    $(`div[class=${className}`).empty();
    values.forEach(element => {
        let text = ""
        if(historyName == "history"){
            element.field_changes.forEach(item => {
                text = `Кто изменил: ${element.name} Что изменил: ${item.field} Было: ${item.old_data} Стало: ${item.new_data} Время изменения: ${element.time}`
            })
        }
        else if(historyName == "chat"){
            text = `Кто написал: ${element.name} Сообщение: ${element.text} Время: ${element.time}`
        }
        $(`div[class=${className}`)
        .append($("<div/>")
        .attr("class", "h-name")
        .append($("<span/>")
        .text(text)));
    });
}

function successFunction(data){
    SetVal("#more-form #id_name", data.name)
    SetVal("#more-form #id_description", data.description)
    SetVal("#more-form #id_current_result", data.current_result)
    SetVal("#more-form #id_block", data.block)
    SetVal("#more-form #id_quarter", data.quarter)
    SetVal("#more-form #id_current", convertBool(data.current))
    SetVal("#more-form #id_planned", convertBool(data.planned))
    SetVal("#more-form #id_weight", data.weight)
    SetVal("#more-form #id_mark", data.mark)
    SetVal("#more-form #id_fact_mark", data.fact_mark)
    SetHistory("history", "history-block", data.history)
    SetHistory("chat", "chat-history-block", data.chat)
}

export function request(type, url, data){
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(data) { 
            if(type == "GET"){
                successFunction(data)
            }
        }
    })
}

$(document).on('click', 'p[class=more]', function(e){
    if($(".active")[0] != undefined){
        $(".active")[0].classList.remove("active")
    }
    e.target.classList.add("active");
    /*
        "active" для получение id из подробнее
    */
    let data = {
        goal_id: e.target.id,
    }
    request("GET", "/goal/get_goal", data)
    if($('.hidden')[0] != undefined){
        $('.hidden')[0].classList.remove("hidden")
    }
})

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).on('submit','#more-form',async function(e){
    e.preventDefault();
    let data = {
        goal_id: $('.active')[0].id,
        name: $("#more-form #id_name").val(),
        description: $('#more-form #id_description').val(),
        current_result: $('#more-form #id_current_result').val(),
        block: $('#more-form #id_block').val(),
        quarter: $('#more-form #id_quarter').val(),
        current: $('#more-form #id_current').val(),
        planned: $('#more-form #id_planned').val(),
        weight: $('#more-form #id_weight').val(),
        mark: $('#more-form #id_mark').val(),
        fact_mark: $('#more-form #id_fact_mark').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request("POST", "/goal/edit", data)
    await sleep(sleepTime);
    request("GET", "/goal/get_goal", data)
    $('p[class=active]').removeClass("active")
});

$(document).on('submit','#chat',async function(e){
    e.preventDefault();
    let data = {
        goal_id: $('.active')[0].id,
        message: $('#id_message').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request("POST", "/goal/chat", data)
    await sleep(sleepTime);
    request("GET", "/goal/get_goal", data)
    $('p[class=active]').removeClass("active")
});

