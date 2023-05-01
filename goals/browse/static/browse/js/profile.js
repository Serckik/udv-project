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

let data = request('GET', '/user/get_user_name')
$('.personal-area-block .name').text(data.name)

$(document).on('click', '.user-logo', function(e){
    if( $('.personal-area-block.hidden').length != 0){
        $('.personal-area-block').removeClass('hidden')
    }
    else{
        $('.personal-area-block').addClass('hidden')
    }
})

let profileClicked = false

$(document).on('click', 'html, .user-logo', function(e){
    if(e.currentTarget.classList[0] == 'user-logo'){
        profileClicked = true
        return
    }
    
    if(profileClicked){
        profileClicked = false
        return
    }

    if($('.personal-area-block.hidden').length == 0){
        $('.personal-area-block').addClass('hidden')
    }
})