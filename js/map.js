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

  var deletePins = function () {
    var mapPins = mapPinListElement.querySelectorAll('.map__pin');
    var initialMapPin = mapPinListElement.querySelector('.map__pin--main');

    mapPins.forEach(function (item) {
      if (item !== initialMapPin) {
        mapPinListElement.removeChild(item);
      }
    });
  };

  var hideMap = function () {
    var mapFilters = document.querySelectorAll('.map__filters select, .map__filters fieldset, .ad-form fieldset');

    document.querySelector('.map').classList.add('map--faded');
    document.querySelector('.ad-form').classList.add('ad-form--disabled');

    mapFilters.forEach(function (item) {
      item.disabled = true;
    });

    deletePins();
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

  var renderOfferInfo = function (data) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(window.card.create(data));

    newCard.insertBefore(fragment, filtersContainer);

    document.querySelector('.map .map__card .popup__close').addEventListener('click', function () {
      closeCard();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.Const.ESC_KEYCODE) {
        closeCard();
      }
    });
  };

  var renderMapPin = function (data) {
    var fragment = document.createDocumentFragment();

    var filteredData = window.filter.setOffersLimit(data, window.filter.OFFERS_LIMIT);

    filteredData.forEach(function (item) {
      if (item.offer) {
        fragment.appendChild(window.pin.create(item));
      }
    });

    mapPinListElement.appendChild(fragment);
  };

  var getData = function (data) {
    window.data.completeOffers = data;

    showMap();
    renderMapPin(window.data.completeOffers);
    window.form.showPinCoodrinates();
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

      if (!window.map.firstMouseUp) {
        window.backend.download(getData, window.form.showErrorMessage);

        window.map.firstMouseUp = true;
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (prevEvt) {
          prevEvt.preventDefault();

          mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMain.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  window.map = {
    hide: hideMap,
    closeCard: closeCard,
    renderOfferInfo: renderOfferInfo,
    renderPin: renderMapPin,
    deletePins: deletePins,
    firstMouseUp: false
  };
})();
