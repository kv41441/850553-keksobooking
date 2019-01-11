'use strict';

(function () {
  var OFFERS_LIMIT = 5;

  var filtersForm = document.querySelector('.map__filters');

  var PriceMap = {
    low: {
      min: 0,
      max: 10000
    },

    middle: {
      min: 10000,
      max: 50000
    },

    high: {
      min: 50000,
      max: Infinity
    },

    any: {
      min: 0,
      max: Infinity
    }
  };

  var setOffersLimit = function (data, limit) {
    return data.slice(0, limit);
  };

  var applyFilter = function (filters) {
    var houseType = filters['housing-type'];
    var price = filters['housing-price'];
    var rooms = filters['housing-rooms'];
    var guests = filters['housing-guests'];


    var filteredPrice = window.data.completeOffers.filter(function (item) {
      return item.offer.price >= PriceMap[price.value].min &&
        item.offer.price <= PriceMap[price.value].max;
    });

    var filteredType = filteredPrice.filter(function (item) {
      var current = houseType.options[houseType.selectedIndex].value;

      if (current !== 'any') {
        return item.offer.type === current;
      }
      return Boolean(item.offer.type) === true;
    });

    var filteredRooms = filteredType.filter(function (item) {
      if (rooms.value !== 'any') {
        return item.offer.rooms === Number(rooms.value);
      }
      return Boolean(item.offer.rooms) === true || item.offer.rooms === 0;
    });

    var filteredGuests = filteredRooms.filter(function (item) {
      if (guests.value !== 'any') {
        return item.offer.guests === Number(guests.value);
      }
      return Boolean(item.offer.guests) === true || item.offer.guests === 0;
    });

    var filterFeatures = function (data) {
      var featuresMatch = true;
      var selectedFeatures = filtersForm.querySelectorAll('input[type="checkbox"]:checked');

      selectedFeatures.forEach(function (item) {
        if (data.offer.features.indexOf(item.value) === -1) {
          featuresMatch = false;
        }
      });

      return featuresMatch;
    };

    var filteredFeatures = filteredGuests.filter(function (item) {
      return filterFeatures(item);
    });

    var completeFilter = setOffersLimit(filteredFeatures, OFFERS_LIMIT);

    window.map.closeCard();
    window.map.deletePins();
    window.map.renderPin(completeFilter);
  };

  filtersForm.addEventListener('change', function () {
    var filters = filtersForm.children;
    window.debounce(function () {
      applyFilter(filters);
    });
  });


  window.filter = {
    OFFERS_LIMIT: OFFERS_LIMIT,
    setOffersLimit: setOffersLimit
  };
})();