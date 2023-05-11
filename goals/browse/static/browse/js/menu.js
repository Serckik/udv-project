import { CreateOptionBlocks } from "./openCard.js"
import { quarterRequestData } from "./filter.js"

CreateOptionBlocks(quarterRequestData.quarters, '.left-submenu #card-cvartal')

let title = window.location.href.split('/')[4]
$('.' + title).addClass('current-page')

$('option').mousedown(function(e) {
    var el = e.target;
    e.preventDefault();
    $(this).prop('selected', !$(this).prop('selected'));
    var scrollTop = el.parentNode.scrollTop;
    setTimeout(() => el.parentNode.scrollTo(0, scrollTop), 0);
    return false;
});