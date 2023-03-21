const sleepTime = 100
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
            text = `Кто изменил: ${element.name} Было: ${element.last} Стало: ${element.now} Время изменения: ${element.time}`
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
    SetVal("#id_name", data.name)
    SetVal("#id_description", data.description)
    SetVal("#id_current_result", data.current_result)
    SetVal("#id_block", data.block)
    SetVal("#id_quarter", data.quarter)
    SetVal("#id_current", convertBool(data.current))
    SetVal("#id_planned", convertBool(data.planned))
    SetVal("#id_weight", data.weight)
    SetVal("#id_mark", data.mark)
    SetVal("#id_fact_mark", data.fact_mark)
    SetHistory("history", "history-block", data.history.history)
    SetHistory("chat", "chat-history-block", data.chat.chat)
}

function request(type, url, data){
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
    e.target.classList.add("active");
    /*
        "active" для получение id из подробнее
    */
    let data = {
        goal_id: e.target.id,
    }
    request("GET", "/get_goal", data)
    $('.hidden')[0].classList.remove("hidden")
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).on('submit','#more-form',async function(e){
    e.preventDefault();
    let data = {
        goal_id: $('.active')[0].id,
        name: $("#id_name").val(),
        description: $('#id_description').val(),
        current_result: $('#id_current_result').val(),
        block: $('#id_block').val(),
        quarter: $('#id_quarter').val(),
        current: $('#id_current').val(),
        planned: $('#id_planned').val(),
        weight: $('#id_weight').val(),
        mark: $('#id_mark').val(),
        fact_mark: $('#id_fact_mark').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request("POST", "/edit", data)
    await sleep(sleepTime);
    request("GET", "/get_goal", data)
    $('p[class=active]').removeClass("active")
});

$(document).on('submit','#chat',async function(e){
    e.preventDefault();
    let data = {
        goal_id: $('.active')[0].id,
        message: $('#id_message').val(),
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    }
    request("POST", "/chat", data)
    await sleep(sleepTime);
    request("GET", "/get_goal", data)
    $('p[class=active]').removeClass("active")
});