import { FillForm} from "./openCard.js"

$('.search-checkbox-block p').text('Только выбранные')
$('.done-block').addClass('hidden');
$('.taked-block').removeClass('hidden')
$('.cvartal-select').removeAttr('multiple')

FillForm('add-summary-form')