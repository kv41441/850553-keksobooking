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
    var offerForm = document.querySelector('.ad-form');
    var capacity = document.querySelectorAll('#capacity option');

    offerForm.reset();
    capacity[2].selected = true;
    showInitialPinCoordinates();
    setInitialPinCoordinates();
  };

  var resetPage = function () {
    window.map.hide();
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


  window.form = {
    showPinCoodrinates: showPinCoodrinates
  };
})();
