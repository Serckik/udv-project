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
        async: false
    })
    return returnData
}

let data = request('GET', '/goal/start_init')
export let quarters = data.quarters
export let currentQuarter = data.current_quarter
export let notifications = data.notify
export let userName = data.name
export let userId = data.id

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