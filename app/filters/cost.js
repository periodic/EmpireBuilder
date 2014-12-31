define(['angular'], function () {
  var m = angular.module('EB.Filters.cost', []);

  m.filter('growth', function (Constants, Buildings) {
    return function (input, count, growthFactor) {
      var building = Buildings[buildingId];

      return input * Math.exp((count - 1) * growthFactor);
    };
  });
});
