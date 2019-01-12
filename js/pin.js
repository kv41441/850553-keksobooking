'use strict';

(function () {
  var createMapPin = function (completeOffer) {
    var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPinElement = mapPin.cloneNode(true);


    mapPinElement.style.left = (completeOffer.location.y -
      document.querySelector('.map__pin').clientWidth / 2) + 'px';
    mapPinElement.style.top = (completeOffer.location.x -
      document.querySelector('.map__pin').clientHeight) + 'px';
    mapPinElement.querySelector('img').src = completeOffer.author.avatar;
    mapPinElement.querySelector('img').alt = completeOffer.offer.title;

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
