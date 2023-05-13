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
        error: function(){
            alert('Файл весит больше 2 МБ')
        },
        async: false
    })
    return returnData
}

const button = $('.update-image-body .choose-image')
const input = $('.update-image-body input')

button.on('click', function(){
    input.click()
})

function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }
  
$('.update-image-body input').on('change', function (e) {
    var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop()
    if(!imageExtensions.includes(fileExtension)){
        alert('Неверный формат изображения')
        return
    }
    const reader = new FileReader();

    reader.onload = function(e) {
      const imageUrl = e.target.result;
      $('#load-image').addClass('hidden')
      $('#cropper').removeClass('hidden')
      const imageElement = $('#cropper img')
      imageElement.removeClass('hidden')
      imageElement.attr('src', imageUrl)
      DoCrope()
    };

    reader.readAsDataURL(file);
});

let cropper = null
var croppable = false;

function DoCrope() {
    var image = document.getElementById('image');
    cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        ready: function () {
            croppable = true;
        },
    });
}

$(document).on('click', '.blur', function(e){
    ClearCrop()
})

function ClearCrop(){
    cropper.destroy()
    $('.blur').addClass('hidden')
    $('.update-image').addClass('hidden')
    $('.update-image #load-image').removeClass('hidden')
    $('.update-image #cropper').addClass('hidden')
    $('.update-image input').val('')
    $('.update-image img').attr('src', '')
}

$('#cropper .save-image').on('click', function(e){
    var croppedCanvas;
    var roundedCanvas;

    if (!croppable) {
    return;
    }

    // Crop
    croppedCanvas = cropper.getCroppedCanvas();

    // Round
    roundedCanvas = getRoundedCanvas(croppedCanvas);

    // Show
    request('POST', '/user/upload_image', {file: roundedCanvas.toDataURL(), csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()})
    ClearCrop()
    location.reload()
})