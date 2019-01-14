'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarFileChooser = document.querySelector('.ad-form__field input[type="file"]');
  var imageFileChooser = document.querySelector('.ad-form__upload input[type="file"]');


  var onPhotoChange = function (fileChooser, preview) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (fileChooser.id === 'avatar') {
          preview.src = reader.result;
        } else if (fileChooser.id === 'images') {
          if (window.images.firstChange) {
            var imagesContainer = document.querySelector('.ad-form__photo-container');
            var image = imagesContainer.querySelector('.ad-form__photo');

            imagesContainer.removeChild(image);

            window.images.firstChange = false;
          }

          var newImageContainer = document.createElement('div');
          newImageContainer.classList.add('ad-form__photo');

          var newImage = document.createElement('img');
          newImage.classList.add('ad-form__photo');
          newImage.src = reader.result;

          newImageContainer.appendChild(newImage);
          preview.appendChild(newImageContainer);
        }
      });

      reader.readAsDataURL(file);
    }
  };

  avatarFileChooser.addEventListener('change', function () {
    var avatarPreview = document.querySelector('.ad-form-header__preview img');

    onPhotoChange(avatarFileChooser, avatarPreview);
  });

  imageFileChooser.addEventListener('change', function () {
    var imagePreview = document.querySelector('.ad-form__photo-container');

    onPhotoChange(imageFileChooser, imagePreview);
  });


  window.images = {
    firstChange: true
  };
})();
