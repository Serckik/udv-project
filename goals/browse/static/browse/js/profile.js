import { CreateOptionBlocks } from "./openCard.js"
import { quarterRequestData } from "./filter.js"
const select = $('.personal-area-block .cvartal-select');
console.log(select)
select.selectedIndex = 0;

CreateOptionBlocks(quarterRequestData.quarters, '.personal-area-block #card-cvartal', true)

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
export let userName = data.name
const userId = data.id
$('.header-user .user-logo').attr('src', '/static/users/img/' + userId + '.png')
$('.header-user .user-logo').attr('onerror', "this.src='/static/img/user-logo.png'")
$('.personal-area-block .name').text(data.name)

const profile = document.querySelector('.user-logo');
const profileBlock = document.querySelector('.personal-area-block');

profile.addEventListener('click', () => {
    if (profileBlock.classList.contains('hidden')) {
        profileBlock.classList.remove('hidden');
    } 
    else {
        profileBlock.classList.add('hidden');
        select.addClass('hidden')
    }
});


document.addEventListener('click', (e) => {
    if (e.target.closest('.personal-area-block') || e.target.closest('.user-logo') || e.target.closest('.blur') || e.target.closest('.update-image')) {
      return;
    }
    $('.are-you-sure').addClass('hidden')
    $('.personal-area-block').addClass('hidden')
    select.addClass('hidden')
});

$('.excel-load').on('click', function(){
    if(select.attr('class').includes('hidden')){
        select.removeClass('hidden')
    }
    else{
        select.addClass('hidden')
    }
})

$('.update-image-link').on('click', function(){
    $('.update-image').removeClass('hidden')
    $('.blur').removeClass('hidden')
})

$('.personal-area-block option').on('click', function(e){
    let quarter = $(e.target).val()
    const a = document.createElement('a');
    a.href = '/user/download_excel?quarter=' + quarter;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    select.addClass('hidden')
})

$('.delete-image').on('click', function(){
    $('.are-you-sure').removeClass('hidden')
    
    $('question').on('click', function(e){
        if(e.currentTarget.innerText === 'Да'){
            request('POST', '/user/delete_image', {csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
            location.reload()
        }
        else{
            $('.are-you-sure').addClass('hidden')
        }
    })
})