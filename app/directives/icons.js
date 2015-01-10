define(['angular'], function (_) {
  var m = angular.module('EB.Directives.Icons', [
  ]);

  m.directive('iconMoney', function () {
    return {
      restrict: "E",
      template: "&#xe93b;",
    };
  });

  m.directive('iconScore', function () {
    return {
      restrict: "E",
      template: "&#xe99e;",
    };
  });

  m.directive('iconExploration', function () {
    return {
      restrict: "E",
      template: "&#xe947;",
    };
  });

  m.directive('iconFood', function () {
    return {
      restrict: "E",
      template: "&#xe9a3;",
    };
  });

  m.directive('iconDistance', function () {
    return {
      restrict: "E",
      template: "&#xe949;",
    };
  });

  m.directive('iconPopulation', function () {
    return {
      restrict: "E",
      template: "&#xe972;",
    };
  });

  m.directive('iconCapitol', function () {
    return {
      restrict: "E",
      template: "&#xe921;",
    };
  });

  m.directive('iconUnemployed', function () {
    return {
      restrict: "E",
      template: "&#xe971;",
    };
  });

  m.directive('iconBuildings', function () {
    return {
      restrict: "E",
      template: "&#xe901;",
    };
  });

  m.directive('iconWorkers', function () {
    return {
      restrict: "E",
      template: "&#xe971;",
    };
  });

  m.directive('iconAddWorker', function () {
    return {
      restrict: "E",
      template: "&#xea0a;",
    };
  });

  m.directive('iconRemoveWorker', function () {
    return {
      restrict: "E",
      template: "&#xea0b;",
    };
  });

  m.directive('iconAchievementMet', function () {
    return {
      restrict: "E",
      template: "&#xea10;",
    };
  });
});
