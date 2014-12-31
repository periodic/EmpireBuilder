define(['angular', 'data/constants', 'controllers'], function (_) {
  console.log("Creating City directives.");
  var m = angular.module('EB.Directives.Cities', [
    'EB.Constants',
    'EB.Controllers.CityController',
  ]);

  m.directive('cityList', function () {
    return {
      restrict: 'E',
      scope: {
        cities: '=',
      },
      templateUrl: 'app/directives/templates/city-list.html',
    };
  });

  m.directive('citySummary', function ($controller, Buildings) {
    return {
      restrict: 'E',
      scope: {
        city: '=',
      },
      templateUrl: 'app/directives/templates/city-summary.html',
    };
  });
  console.log("City directives created.");
});


