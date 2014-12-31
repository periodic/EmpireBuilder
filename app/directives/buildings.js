define(['angular', 'data/constants'], function (_) {
  var m = angular.module('EB.Directives.Buildings', [
    'EB.Constants',
    'EB.Controllers',
    'EB.Game',
  ]);

  m.directive('building', function (game) {
    return {
      restrict: 'E',
      scope: {
        building: '=',
        count: '=',
      },
      templateUrl: 'app/directives/templates/building.html',
      link: function (scope, element, attrs) {
        scope.game = game;
      },
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

