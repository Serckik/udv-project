import { SetGroupCards } from "./SetCards.js"
import { Filter, cards} from "./filter.js"

$(document).on('click', '.search-checkbox-block.group', function(e){
    e.currentTarget.classList.toggle('active-sort')
    if($(this).hasClass('active-sort')){
        $('.block-filter').hide()
        $('.order-container-element.weight').addClass('hidden')
        $('.order-container-element.count').removeClass('hidden')
        SetGroupCards(cards.groups)
    }
    else{
        $('.block-filter').show()
        $('.order-container-element.weight').removeClass('hidden')
        $('.order-container-element.count').addClass('hidden')
        Filter()
    }
})

$(document).on('click', '.search-checkbox-block.back-arrow', function (e) { 
    SetGroupCards(cards.groups)
})

