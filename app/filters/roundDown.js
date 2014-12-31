define(['angular'], function () {
  var m = angular.module('EB.Filters.roundDown', []);

  m.filter('roundDown', function () {
    return function (input) {
      if (input) {
        return Math.floor(input || 0);
      } else {
        return input;
      }
    };
  });
});
