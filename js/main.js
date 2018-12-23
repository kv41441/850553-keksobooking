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
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MAX = 5;
var GUESTS_MAX = 10;
var LOCATION_X_MIN = 170;
var LOCATION_X_MAX = document.querySelector('.map__pins').clientHeight;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var ESC_KEYCODE = 27;
var mapPinListElement = document.querySelector('.map__pins');
var newCard = document.querySelector('.map');
var filtersContainer = document.querySelector('.map__filters-container');
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

var closeCard = function () {
  var mapPinList = mapPinListElement.querySelectorAll('.map__pin');

  if (document.querySelector('.map .map__card')) {
    document.querySelector('.map').removeChild(document.querySelector('.map .map__card'));
  }

  mapPinList.forEach(function (item) {
    item.classList.remove('map__pin--active');
  });
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

var resetForm = function () {
  var offerForm = document.querySelector('.ad-form');
  var capacity = document.querySelectorAll('#capacity option');

  offerForm.reset();
  capacity[2].selected = true;
  showInitialPinCoordinates();
  setInitialPinCoordinates();
};

var resetPage = function () {
  hideMap();
  resetForm();
};


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

var createMapPin = function (completeOffer, index) {
  var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinElement = mapPin.cloneNode(true);

  mapPinElement.style.left = (completeOffer.location.y -
    document.querySelector('.map__pin').clientWidth / 2) + 'px';
  mapPinElement.style.top = (completeOffer.location.x -
    document.querySelector('.map__pin').clientHeight) + 'px';
  mapPinElement.querySelector('img').src = completeOffer.author.avatar;
  mapPinElement.querySelector('img').alt = completeOffer.offer.title;

  mapPinElement.addEventListener('click', function () {
    closeCard();

    mapPinElement.classList.add('map__pin--active');

    renderOfferInfo(index);
  });

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

var renderMapPin = function () {
  var fragment = document.createDocumentFragment();

  completeOffers.forEach(function (item, index) {
    fragment.appendChild(createMapPin(item, index));
  });

  mapPinListElement.appendChild(fragment);
};

var renderOfferInfo = function (index) {
  var fragment = document.createDocumentFragment();

  fragment.appendChild(createOfferInfo(completeOffers[index]));

  newCard.insertBefore(fragment, filtersContainer);

  document.querySelector('.map .map__card .popup__close').addEventListener('click', function () {
    closeCard();
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeCard();
    }
  });
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

var completeOffers = createCompleteOffer(8);

mapPinMain.addEventListener('mouseup', function () {
  showMap();
  renderMapPin();
  showPinCoodrinates();
});

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
