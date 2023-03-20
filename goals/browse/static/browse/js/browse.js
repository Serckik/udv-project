function convertBool(bool){
    if(bool){
        return "Да"
    }
    return "Нет"
}



$(document).on('click', 'p[class=more]', function(e){
    e.target.classList.add("active");
    /*
        "active" для получение id из подробнее
    */
    $.ajax({
        type:'POST',
        url:'/get_goal',
        data:
        {
            goal_id: e.target.id,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(data){
            let isPlanned = convertBool(data.planned)
            let isCurrent = convertBool(data.current)
            $("#id_name").val(data.name)
            $("#id_description").val(data.description)
            $("#id_current_result").val(data.current_result)
            $("#id_block :contains('" + data.block + "')").attr("selected", true)
            $("#id_quarter :contains('" + data.quarter + "')").attr("selected", true)
            $("#id_current :contains('" + isCurrent + "')").attr("selected", true)
            $("#id_planned :contains('" + isPlanned + "')").attr("selected", true)
            $("#id_weight").val(data.weight)
            $("#id_mark :contains('" + data.mark + "')").first().attr("selected", true)
            $("#id_fact_mark :contains('" + data.fact_mark + "')").first().attr("selected", true)
            let historyArr = data.history.history
            let chatHistoryArr = data.chat.chat
            for (let index = 0; index < historyArr.length; index++) {
                $("div[class=history-block]")
                .append($("<div/>")
                .attr("class", "h-name")
                .append($("<span/>")
                .text("Кто изменил: " + historyArr[index].name + " Было: " + historyArr[index].last + " Стало: " + historyArr[index].now + " Время изменения: " + historyArr[index].time)));
            }
            for (let index = 0; index < chatHistoryArr.length; index++) {
                $("div[class=history-block]")
                .append($("<div/>")
                .attr("class", "h-name")
                .append($("<span/>")
                .text("Кто написал: " + chatHistoryArr[index].name + " Сообщение: " + chatHistoryArr[index].text + " Время: " + historyArr[index].time)));
            }
        }
    })
    $('.hidden')[0].classList.remove("hidden")
})


$(document).on('submit','#more-form',function(e){
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/edit',
        data:
        {
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
        },
        })
    $('p[class=active]').removeClass("active")
});

$(document).on('submit','#chat',function(e){
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/chat',
        data:
        {
            goal_id: $('.active')[0].id,
            message: $('#id_message').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        })
    $('p[class=active]').removeClass("active")
});