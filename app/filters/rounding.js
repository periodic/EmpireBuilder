define(['angular'], function () {
  var m = angular.module('EB.Filters.Rounding', []);

  m.filter('roundDown', function () {
    return function (input) {
      if (input) {
        return Math.floor(input || 0);
      } else {
        return input;
      }
    };
  });

  m.filter('roundUp', function () {
    return function (input) {
      if (input) {
        return Math.ceil(input || 0);
      } else {
        return input;
      }
    };
  });
});
