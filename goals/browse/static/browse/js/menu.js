const title = window.location.href.split('/')[4];
$('.' + title).addClass('current-page');

$('option').on('mousedown', function(e) {
  e.preventDefault();
  $(this).prop('selected', !$(this).prop('selected'));
  const el = e.target;
  const scrollTop = el.parentNode.scrollTop;
  setTimeout(() => el.parentNode.scrollTo(0, scrollTop), 0);
  return false;
});