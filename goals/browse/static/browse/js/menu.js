import { CreateOptionBlocks } from "./openCard.js"
import { quarterRequestData } from "./filter.js"

CreateOptionBlocks(quarterRequestData.quarters, '.left-submenu #card-cvartal')

let title = $('title')[0].text
$('.' + title).addClass('current-page')

$('option').mousedown(function(e) {
    var el = e.target;
    e.preventDefault();
    $(this).prop('selected', !$(this).prop('selected'));
    var scrollTop = el.parentNode.scrollTop;
    setTimeout(() => el.parentNode.scrollTo(0, scrollTop), 0);
    return false;
});