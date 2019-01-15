'use strict';

(function () {
  var createMapPin = function (completeOffer) {
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPinElement = mapPin.cloneNode(true);
    var existingMapPinElement = document.querySelector('.map__pin');
    var mapPinElementImage = mapPinElement.querySelector('img');


    mapPinElement.style.left = (completeOffer.location.y -
      existingMapPinElement.clientWidth / 2) + 'px';
    mapPinElement.style.top = (completeOffer.location.x -
      existingMapPinElement.clientHeight) + 'px';
    mapPinElementImage.src = completeOffer.author.avatar;
    mapPinElementImage.alt = completeOffer.offer.title;

    mapPinElement.addEventListener('click', function () {
      window.map.closeCard();

      mapPinElement.classList.add('map__pin--active');

      window.map.renderOfferInfo(completeOffer);
    });

    return mapPinElement;
  };


  window.pin = {
    create: createMapPin
  };
})();
