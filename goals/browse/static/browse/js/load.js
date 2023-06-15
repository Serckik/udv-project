export function request(type, url, data){
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
        error: function() {
            alert('Что-то пошло не так')
        },
        async: false
    })
    return returnData
}

export function sleep(ms=100) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export let colors = {"Оценка": "rgba(255, 81, 81, 0.44)",
              "Подбор": "rgba(255, 153, 0, 0.44)",
              "Адаптация": "rgba(119, 255, 107, 0.44)",
              "Корп. культура и бенефиты": "rgba(121, 174, 168, 0.44)",
              "HR-бренд внешний": "rgba(0, 178, 255, 0.44)",
              "HR-сопровождение": "rgba(219, 222, 84, 0.44)",
              "Внутренняя работа отдела": "rgba(143, 64, 206, 0.44)",
              "Кадровый учет и зп": "rgba(248, 22, 225, 0.44)",
              "Развитие персонала": "rgba(146, 137, 249, 0.44)"}

export let opacityColors = {
    "Оценка": "rgba(255, 81, 81, 0.1)",
    "Подбор": "rgba(255, 153, 0, 0.1)",
    "Адаптация": "rgba(119, 255, 107, 0.1)",
    "Корп. культура и бенефиты": "rgba(121, 174, 168, 0.1)",
    "HR-бренд внешний": "rgba(0, 178, 255, 0.1)",
    "HR-сопровождение": "rgba(219, 222, 84, 0.1)",
    "Внутренняя работа отдела": "rgba(143, 64, 206, 0.1)",
    "Кадровый учет и зп": "rgba(248, 22, 225, 0.1)",
    "Развитие персонала": "rgba(146, 137, 249, 0.1)"
}

export let vectors = ["M2 13.7412H33.8687V32.1915C33.8687 33.1179 33.1178 33.8688 32.1914 33.8688H3.6773C2.75095 33.8688 2 33.1179 2 32.1915V13.7412Z",
    "M2 6.19341C2 5.26707 2.75095 4.51611 3.6773 4.51611H32.1914C33.1178 4.51611 33.8687 5.26707 33.8687 6.19341V13.7413H2V6.19341Z",
    "M11.2246 2V8.70921",
    "M24.6436 2V8.70921"]

let block = ["Оценка", "Подбор", "Адаптация", "Корп. культура и бенефиты", "HR-бренд внешний", "HR-сопровождение", "Внутренняя работа отдела", "Кадровый учет и зп", 
"Развитие персонала"]
let category = ['Запланированная', 'Незапланированная']
const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
let score = []
for (let index = 0; index < 121; index += 5) {
    score.push(index + '%')
}
let answer = ['Да', 'Нет']

let data = request('GET', '/goal/start_init')
export let quarters = data.quarters
export let currentQuarter = data.current_quarter
export let notifications = data.notify
export let userName = data.name
export let userId = data.id
export let images = data.images

export function UpdateNotification(){
    notifications = request('GET', '/user/get_notifications')
}

export function CreateOptionBlocks(values, id, isCurrentOnly=false){
    if($(id).length == 0) { return }
    values.forEach(element => {
        let option = $("<option></option>").text(element)
        option.attr('value', element.split('%')[0])
        if(currentQuarter.includes(element) && isCurrentOnly){
            option.attr('selected','selected')
        }
        else if(currentQuarter.includes(element) && !isCurrentOnly){
            option.attr('selected','selected')
        }
        $(id).append(option);
    });
}

CreateOptionBlocks(quarters, '.personal-area-block #card-cvartal', true)
CreateOptionBlocks(quarters, '.left-submenu #card-cvartal')

export function GetDate(str) { 
    let dateObj = new Date(str);
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`
}

FillForm('more-form')

export function FillForm(idForm) { 
    CreateOptionBlocks(block, '#' + idForm +' #card-block')
    CreateOptionBlocks(category, '#' + idForm +' #card-category')
    CreateOptionBlocks(quarters, '#' + idForm +' #card-cvartal')
    CreateOptionBlocks(score, '#' + idForm +' #card-own-grade')
    CreateOptionBlocks(score, '#' + idForm +' #card-leader-grade')
    CreateOptionBlocks(score, '#' + idForm +' #card-weight')
    CreateOptionBlocks(answer, '#' + idForm +' #card-approve')
}