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
            let isPlanned = "Нет"
            if(data.planned){
                isPlanned = "Да"
            }
            $("#id_name").val(data.name)
            $("#id_description").val(data.description)
            $("#id_block :contains('" + data.block +"')").attr("selected", "selected");
            $("#id_quarter :contains('" + data.quarter +"')").attr("selected", "selected");
            $("#id_planned :contains('" + isPlanned +"')").attr("selected", "selected");
            $("#id_weight").val(data.weight)
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
            block: $('#id_block').val(),
            quarter: $('#id_quarter').val(),
            planned: $('#id_planned').val(),
            weight: $('#id_weight').val(),
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