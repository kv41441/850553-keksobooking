'use strict';

(function () {
  var createOfferInfo = function (completeOffer) {
    var card = document.querySelector('#card').content.querySelector('.map__card');
    var cardElement = card.cloneNode(true);
    var houseType = '';
    var avatar = cardElement.querySelector('.popup__avatar');
    var title = cardElement.querySelector('.popup__title');
    var address = cardElement.querySelector('.popup__text--address');
    var price = cardElement.querySelector('.popup__text--price');
    var type = cardElement.querySelector('.popup__type');
    var rooms = cardElement.querySelector('.popup__text--capacity');
    var time = cardElement.querySelector('.popup__text--time');
    var features = cardElement.querySelector('.popup__features');
    var description = cardElement.querySelector('.popup__description');
    var photo = cardElement.querySelector('.popup__photo');


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

    title.textContent = completeOffer.offer.title;
    address.textContent = completeOffer.offer.address;
    price.textContent = completeOffer.offer.price + '₽/ночь';
    type.textContent = houseType;
    rooms.textContent = completeOffer.offer.rooms +
      ' комнаты для ' + completeOffer.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' +
      completeOffer.offer.checkin + ', выезд до ' + completeOffer.offer.checkout;

    features.textContent = '';
    completeOffer.offer.features.forEach(function (item) {
      var featureSelector = 'popup__feature--' + item;
      var cardFeatureElement = card.querySelector('.popup__feature').cloneNode(true);

      cardFeatureElement.classList.remove('popup__feature--wifi');
      cardFeatureElement.classList.add(featureSelector);
      cardElement.querySelector('.popup__features').appendChild(cardFeatureElement);
    });

    description.textContent = completeOffer.offer.description;

    photo.src = completeOffer.offer.photos[0];
    for (var i = 1; i < completeOffer.offer.photos.length; i++) {
      var cardImageElement = card.querySelector('.popup__photo').cloneNode(true);

      cardImageElement.src = completeOffer.offer.photos[i];
      cardElement.querySelector('.popup__photos').appendChild(cardImageElement);
    }

    avatar.src = completeOffer.author.avatar;

    return cardElement;
  };


  window.card = {
    createOfferInfo: createOfferInfo
  };
})();
