define(['angular', 'data/constants'], function (_) {
  var m = angular.module('EB.Directives.Buildings', [
    'EB.Constants',
    'EB.Controllers',
  ]);

  m.directive('building', function () {
    return {
      restrict: 'E',
      scope: {
        building: '=',
        count: '=',
      },
      templateUrl: 'app/directives/templates/building.html',
    };
  });

  m.directive('buildings', function (Buildings) {
    return {
      restrict: 'E',
      scope: {
        counts: '=counts',
      },
      link: function (scope, element, attrs) {
        scope.Buildings = Buildings;
      },
      templateUrl: 'app/directives/templates/buildings.html'
    };
  });
});

