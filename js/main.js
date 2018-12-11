'use strict';

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checkin = ['12:00', '13:00', '14:00'];
var checkout = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var completeOffers = [];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MAX = 5;
var GUESTS_MAX = 10;
var LOCATION_X_MIN = 100;
var LOCATION_X_MAX = document.querySelector('.map__pins').clientHeight;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var offerLocation = {};
var mapPinListElement = document.querySelector('.map__pins');
var newCard = document.querySelector('.map');
var filtersContainer = document.querySelector('.map__filters-container');


var iSeeYou = function () {
  document.querySelector('.map').classList.remove('map--faded');
};
iSeeYou();

var getRandomElement = function (array) {
  var randIndex = Math.floor(Math.random() * array.length);

  return randIndex;
};

var createAuthor = function (avatarIndex) {
  var author = avatarIndex < 10 ? {avatar: 'img/avatars/user' + '0' + avatarIndex + '.png'}
    : {avatar: 'img/avatars/user' + avatarIndex + '.png'};

  return author;
};

var createOffer = function () {
  var randFeaturesCount = Math.floor(Math.random() * features.length + 1);
  var offerFeatures = [];

  var randomizeArray = function () {
    return Math.random() - 0.5;
  };

  features.sort(randomizeArray);
  for (var i = 0; i < randFeaturesCount; i++) {
    offerFeatures.push(features[i]);
  }

  var offer = {
    title: titles[getRandomElement(titles)],
    address: offerLocation.x + ', ' + offerLocation.y,
    price: Math.floor(Math.random() * (PRICE_MAX - PRICE_MIN + 1) + PRICE_MIN),
    type: types[getRandomElement(types)],
    rooms: Math.floor(Math.random() * ROOMS_MAX + 1),
    guests: Math.floor(Math.random() * GUESTS_MAX + 1),
    checkin: checkin[getRandomElement(checkin)],
    checkout: checkout[getRandomElement(checkout)],
    features: offerFeatures,
    description: '',
    photos: photos.sort(randomizeArray)
  };

  return offer;
};

var createLocation = function () {
  var location = {
    x: Math.floor(Math.random() * (LOCATION_X_MAX - LOCATION_X_MIN + 1) + LOCATION_X_MIN),
    y: Math.floor(Math.random() * (LOCATION_Y_MAX - LOCATION_Y_MIN + 1) + LOCATION_Y_MIN)
  };

  return location;
};

var createCompleteOffer = function (count) {
  var avatarIndex;
  completeOffers = [];

  for (var i = 1; i <= count; i++) {
    offerLocation = createLocation();
    avatarIndex = i;

    var completeOffer = {
      author: createAuthor(avatarIndex),
      offer: createOffer(),
      location: offerLocation
    };

    completeOffers.push(completeOffer);
  }

  return completeOffers;
};
createCompleteOffer(8);

var createMapPin = function (completeOffer) {
  var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinElement = mapPin.cloneNode(true);

  mapPinElement.style.left = (completeOffer.location.y -
    document.querySelector('.map__pin').clientWidth / 2) + 'px';
  mapPinElement.style.top = (completeOffer.location.x -
    document.querySelector('.map__pin').clientHeight) + 'px';
  mapPinElement.querySelector('img').src = completeOffer.author.avatar;
  mapPinElement.querySelector('img').alt = completeOffer.offer.title;

  return mapPinElement;
};

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
  cardElement.querySelector('.popup__features').textContent = completeOffer.offer.features;
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

var renderMapPin = function () {
  var fragment = document.createDocumentFragment();

  completeOffers.forEach(function (item) {
    fragment.appendChild(createMapPin(item));
  });

  mapPinListElement.appendChild(fragment);
};
renderMapPin();

var renderOfferInfo = function () {
  var fragment = document.createDocumentFragment();

  completeOffers.forEach(function () {
    fragment.appendChild(createOfferInfo(completeOffers[0]));
  });

  newCard.insertBefore(fragment, filtersContainer);
};
renderOfferInfo();
