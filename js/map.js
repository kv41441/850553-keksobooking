'use strict';

(function () {
  var newCard = document.querySelector('.map');
  var filtersContainer = document.querySelector('.map__filters-container');
  var mapPinListElement = document.querySelector('.map__pins');
  var map = document.querySelector('.map__overlay');
  var mapPinMain = document.querySelector('.map__pin--main');


  var showMap = function () {
    var mapFilters = document.querySelectorAll('.map__filters select, .map__filters fieldset, .ad-form fieldset');

    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.ad-form').classList.remove('ad-form--disabled');

    mapFilters.forEach(function (item) {
      item.disabled = false;
    });
  };

  var hideMap = function () {
    var mapFilters = document.querySelectorAll('.map__filters select, .map__filters fieldset, .ad-form fieldset');
    var mapPins = mapPinListElement.querySelectorAll('.map__pin');
    var initialMapPin = mapPinListElement.querySelector('.map__pin--main');

    document.querySelector('.map').classList.add('map--faded');
    document.querySelector('.ad-form').classList.add('ad-form--disabled');

    mapFilters.forEach(function (item) {
      item.disabled = true;
    });

    mapPins.forEach(function (item) {
      if (item !== initialMapPin) {
        mapPinListElement.removeChild(item);
      }
    });
  };

  var closeCard = function () {
    var mapPinList = mapPinListElement.querySelectorAll('.map__pin');

    if (document.querySelector('.map .map__card')) {
      document.querySelector('.map').removeChild(document.querySelector('.map .map__card'));
    }

    mapPinList.forEach(function (item) {
      item.classList.remove('map__pin--active');
    });
  };

  var renderOfferInfo = function (index) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(window.card.createOfferInfo(window.data.completeOffers[index]));

    newCard.insertBefore(fragment, filtersContainer);

    document.querySelector('.map .map__card .popup__close').addEventListener('click', function () {
      closeCard();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.const.escKeycode) {
        closeCard();
      }
    });
  };

  var renderMapPin = function () {
    var fragment = document.createDocumentFragment();

    window.data.completeOffers.forEach(function (item, index) {
      fragment.appendChild(window.pin.create(item, index));
    });

    mapPinListElement.appendChild(fragment);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var dragged = false;
    var firstMove = true;

    var COORD_X_MIN = 0;
    var COORD_X_MAX = map.offsetWidth - mapPinMain.offsetWidth;
    var COORD_Y_MIN = 130;
    var COORD_Y_MAX = 630;


    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      if (firstMove) {
        showMap();

        firstMove = false;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };


      if (mapPinMain.offsetLeft < COORD_X_MIN) {
        mapPinMain.style.left = COORD_X_MIN + 'px';
      }

      if (mapPinMain.offsetLeft > COORD_X_MAX) {
        mapPinMain.style.left = COORD_X_MAX + 'px';
      }

      if (mapPinMain.offsetTop < COORD_Y_MIN) {
        mapPinMain.style.top = COORD_Y_MIN + 'px';
      }

      if (mapPinMain.offsetTop > COORD_Y_MAX) {
        mapPinMain.style.top = COORD_Y_MAX + 'px';
      }

      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';

      window.form.showPinCoodrinates();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (prevEvt) {
          prevEvt.preventDefault();

          mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMain.addEventListener('click', onClickPreventDefault);
      }

      showMap();
      renderMapPin();
      window.form.showPinCoodrinates();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  window.map = {
    hide: hideMap,
    closeCard: closeCard,
    renderOfferInfo: renderOfferInfo
  };
})();
