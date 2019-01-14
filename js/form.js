'use strict';

(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var initialMainPinX = mapPinMain.offsetLeft;
  var initialMainPinY = mapPinMain.offsetTop;
  var addressInput = document.querySelector('#address');
  var houseTypeSelect = document.querySelector('#type');
  var timeSelect = document.querySelector('.ad-form__element--time');
  var roomNumberSelect = document.querySelector('#room_number');
  var resetButton = document.querySelector('.ad-form__reset');
  var main = document.querySelector('main');
  var form = document.querySelector('.ad-form');


  var showInitialPinCoordinates = function () {
    var initialMapPinX = Math.round(initialMainPinX + mapPinMain.clientWidth / 2);
    var initialMapPinY = Math.round(initialMainPinY + mapPinMain.clientHeight / 2);

    addressInput.value = initialMapPinX + ', ' + initialMapPinY;
  };

  var setInitialPinCoordinates = function () {
    mapPinMain.style.left = initialMainPinX + 'px';
    mapPinMain.style.top = initialMainPinY + 'px';
  };

  var setMinPrice = function () {
    var priceInput = document.querySelector('#price');
    var houseType = document.querySelectorAll('#type option');

    houseType.forEach(function (item) {
      if (item.selected) {
        switch (item.value) {
          case 'bungalo':
            priceInput.placeholder = '0';
            priceInput.min = 0;
            break;

          case 'flat':
            priceInput.placeholder = '1000';
            priceInput.min = 1000;
            break;

          case 'house':
            priceInput.placeholder = '5000';
            priceInput.min = 5000;
            break;

          case 'palace':
            priceInput.placeholder = '10000';
            priceInput.min = 10000;
            break;
        }
      }
    });
  };

  var timeSync = function (target) {
    var timeIn = document.querySelectorAll('#timein option');
    var timeOut = document.querySelectorAll('#timeout option');

    if (target === 'timein') {
      timeIn.forEach(function (item, i) {
        if (item.selected) {
          timeOut[i].selected = true;
        }
      });
    } else if (target === 'timeout') {
      timeOut.forEach(function (item, i) {
        if (item.selected) {
          timeIn[i].selected = true;
        }
      });
    }
  };

  var houseCapacityChange = function () {
    var roomNumber = document.querySelectorAll('#room_number option');
    var capacity = document.querySelectorAll('#capacity option');

    capacity.forEach(function (capItem) {
      capItem.disabled = false;
    });

    roomNumber.forEach(function (roomItem) {
      if (roomItem.selected) {
        switch (roomItem.value) {
          case '1':
            capacity.forEach(function (capItem) {
              if (capItem.value !== '1') {
                capItem.disabled = true;
              } else {
                capItem.selected = true;
              }
            });
            break;

          case '2':
            capacity.forEach(function (capItem) {
              if (capItem.value !== '1' && capItem.value !== '2') {
                capItem.disabled = true;
              } else {
                capacity[1].selected = true;
              }
            });
            break;

          case '3':
            capacity.forEach(function (capItem) {
              if (capItem.value === '0') {
                capItem.disabled = true;
              } else {
                capacity[0].selected = true;
              }
            });
            break;

          case '100':
            capacity.forEach(function (capItem) {
              if (capItem.value !== '0') {
                capItem.disabled = true;
              } else {
                capItem.selected = true;
              }
            });
            break;
        }
      }
    });
  };

  var resetForm = function () {
    var capacity = document.querySelectorAll('#capacity option');

    form.reset();
    capacity[2].selected = true;
    showInitialPinCoordinates();
    setInitialPinCoordinates();
  };

  var resetPage = function () {
    var previewImage = document.querySelector('.ad-form-header__preview img');
    var images = document.querySelectorAll('.ad-form__photo');
    var imagesContainer = document.querySelector('.ad-form__photo-container');

    previewImage.src = 'img/muffin-grey.svg';

    images.forEach(function (item) {
      item.remove();
    });

    var imageContainer = document.createElement('div');
    imageContainer.classList.add('ad-form__photo');
    imagesContainer.appendChild(imageContainer);

    window.images.firstChange = true;

    window.map.hide();
    window.map.firstMouseUp = false;
    window.map.closeCard();
    resetForm();
  };

  var showPinCoodrinates = function () {
    var mapPinPseudoHeight = parseInt(window.getComputedStyle(mapPinMain, '::after').height, 10);
    var mapPinX = Math.round(mapPinMain.offsetLeft + mapPinMain.clientWidth / 2);
    var mapPinY = Math.round(mapPinMain.offsetTop + mapPinMain.clientHeight + mapPinPseudoHeight);

    addressInput.value = mapPinX + ', ' + mapPinY;
  };

  showInitialPinCoordinates();
  setMinPrice();
  houseCapacityChange();

  houseTypeSelect.addEventListener('change', function () {
    setMinPrice();
  });

  timeSelect.addEventListener('change', function (evt) {
    var target = evt.target.id;

    timeSync(target);
  });

  roomNumberSelect.addEventListener('change', function () {
    houseCapacityChange();
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    resetPage();
  });


  var showSuccessMessage = function () {
    var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
    var newSuccessMessage = successMessageTemplate.cloneNode(true);

    main.appendChild(newSuccessMessage);

    document.addEventListener('click', closeSuccessMessage);
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.Const.ESC_KEYCODE) {
        closeSuccessMessage();
      }
    });
  };

  var closeSuccessMessage = function () {
    var successMsg = document.querySelector('.success');

    if (successMsg) {
      main.removeChild(successMsg);

      document.removeEventListener('click', closeSuccessMessage);
      document.removeEventListener('keydown', closeSuccessMessage);

      resetPage();
    }
  };

  var showErrorMessage = function (messageText) {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var newErrorMessage = errorMessageTemplate.cloneNode(true);
    var errorMessageButton = errorMessageTemplate.querySelector('.error__button');
    var errorMessageText = errorMessageTemplate.querySelector('.error__message');

    errorMessageText.textContent = messageText;

    main.appendChild(newErrorMessage);

    document.addEventListener('click', closeErrorMessage);
    errorMessageButton.addEventListener('click', function () {
      resetPage();
      closeErrorMessage();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.Const.ESC_KEYCODE) {
        closeErrorMessage();
      }
    });
  };

  var closeErrorMessage = function () {
    var errorMsg = document.querySelector('.error');

    if (errorMsg) {
      main.removeChild(errorMsg);

      document.removeEventListener('click', closeErrorMessage);
      errorMsg.removeEventListener('keydown', closeErrorMessage);
    }
  };


  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    addressInput.disabled = false;

    var formData = new FormData(form);

    addressInput.disabled = true;

    window.backend.upload(formData, showSuccessMessage, showErrorMessage);
  });


  window.form = {
    showPinCoodrinates: showPinCoodrinates,
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage
  };
})();
