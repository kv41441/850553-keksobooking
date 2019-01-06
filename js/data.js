'use strict';

(function () {
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
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ROOMS_MAX = 5;
  var GUESTS_MAX = 10;
  var LOCATION_X_MIN = 170;
  var LOCATION_X_MAX = document.querySelector('.map__pins').clientHeight;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;


  var getRandomElement = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  var randomizeArray = function (array) {
    var newArray = array.slice();

    for (var i = newArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }

    return newArray;
  };

  var randomInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var createOffer = function (avatarIndex) {
    var offerFeatures = [];
    var locationX = randomInRange(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = randomInRange(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var avatarNumber = avatarIndex < 10 ? '0' + avatarIndex : avatarIndex;
    var featuresMin = randomInRange(0, features.length - 1);
    var featuresMax = randomInRange(featuresMin + 1, features.length);
    var randFeatures = randomizeArray(features);

    offerFeatures = randFeatures.slice(featuresMin, featuresMax);

    var author = {avatar: 'img/avatars/user' + avatarNumber + '.png'};

    var offer = {
      title: getRandomElement(titles),
      address: locationX + ', ' + locationY,
      price: Math.floor(Math.random() * (PRICE_MAX - PRICE_MIN + 1) + PRICE_MIN),
      type: getRandomElement(types),
      rooms: Math.floor(Math.random() * ROOMS_MAX + 1),
      guests: Math.floor(Math.random() * GUESTS_MAX + 1),
      checkin: getRandomElement(checkin),
      checkout: getRandomElement(checkout),
      features: offerFeatures,
      description: '',
      photos: randomizeArray(photos)
    };

    var location = {
      x: locationX,
      y: locationY
    };

    var newOffer = {
      author: author,
      offer: offer,
      location: location
    };

    return newOffer;
  };

  var createCompleteOffer = function (count) {
    var completeOffers = [];

    for (var i = 1; i <= count; i++) {
      var avatarIndex = i;
      var newOffer = createOffer(avatarIndex);

      var completeOffer = {
        author: newOffer.author,
        offer: newOffer.offer,
        location: newOffer.location
      };

      completeOffers.push(completeOffer);
    }

    return completeOffers;
  };


  window.data = {
    completeOffers: createCompleteOffer(8)
  };
})();
