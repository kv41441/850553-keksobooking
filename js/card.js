'use strict';

(function () {
  var createOfferInfo = function (completeOffer) {
    var card = document.querySelector('#card').content.querySelector('.map__card');
    var cardElement = card.cloneNode(true);
    var houseType = '';

    switch (completeOffer.offer.type) {
      case 'palace':
        houseType = 'Дворец';
        break;
      case 'flat':
        houseType = 'Квартира';
        break;
      case 'house':
        houseType = 'Дом';
        break;
      case 'bungalo':
        houseType = 'Бунгало';
        break;
    }

    cardElement.querySelector('.popup__title').textContent = completeOffer.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = completeOffer.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = completeOffer.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = houseType;
    cardElement.querySelector('.popup__text--capacity').textContent = completeOffer.offer.rooms +
      ' комнаты для ' + completeOffer.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' +
      completeOffer.offer.checkin + ', выезд до ' + completeOffer.offer.checkout;

    cardElement.querySelector('.popup__features').textContent = '';
    completeOffer.offer.features.forEach(function (item) {
      var featureSelector = 'popup__feature--' + item;
      var cardFeatureElement = card.querySelector('.popup__feature').cloneNode(true);

      cardFeatureElement.classList.remove('popup__feature--wifi');
      cardFeatureElement.classList.add(featureSelector);
      cardElement.querySelector('.popup__features').appendChild(cardFeatureElement);
    });

    cardElement.querySelector('.popup__description').textContent = completeOffer.offer.description;

    cardElement.querySelector('.popup__photo').src = completeOffer.offer.photos[0];
    for (var i = 1; i < completeOffer.offer.photos.length; i++) {
      var cardImageElement = card.querySelector('.popup__photo').cloneNode(true);

      cardImageElement.src = completeOffer.offer.photos[i];
      cardElement.querySelector('.popup__photos').appendChild(cardImageElement);
    }

    cardElement.querySelector('.popup__avatar').src = completeOffer.author.avatar;

    return cardElement;
  };


  window.card = {
    createOfferInfo: createOfferInfo
  };
})();
