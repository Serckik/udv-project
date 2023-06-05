import { userName, userId } from "./load.js";

const select = $('.personal-area-block .cvartal-select');
select.selectedIndex = 0;

$('.header-user .user-logo').attr('src', '/static/users/img/' + userId + '.png');
$('.header-user .user-logo').attr('onerror', "this.src='/static/img/user-logo.png'");
$('.personal-area-block .name').text(userName);

const profile = document.querySelector('.user-logo');
const profileBlock = document.querySelector('.personal-area-block');

profile.addEventListener('click', () => {
  profileBlock.classList.toggle('hidden');
  select.addClass('hidden');
});

document.addEventListener('click', (e) => {
  if (
    e.target.closest('.personal-area-block') ||
    e.target.closest('.user-logo') ||
    e.target.closest('.blur') ||
    e.target.closest('.update-image')
  ) {
    return;
  }
  $('.are-you-sure').addClass('hidden');
  $('.personal-area-block').addClass('hidden');
  select.addClass('hidden');
});

$('.excel-load').on('click', function() {
  select.toggleClass('hidden');
});

$('.update-image-link').on('click', function() {
  $('.update-image').removeClass('hidden');
  $('.blur').removeClass('hidden');
});

$('.personal-area-block option').on('click', function(e) {
  const quarter = $(e.target).val();
  const a = document.createElement('a');
  a.href = '/user/download_excel?quarter=' + quarter;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  select.addClass('hidden');
});