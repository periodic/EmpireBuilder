define(['angular'], function (_) {
  var m = angular.module('EB.Directives.SimpleTooltip', [
  ]);

  m.directive('simpleTooltip', function () {
    return {
      restrict: "A",
      scope: {
        simpleTooltip: '@',
      },
      link: function (scope, element, attrs) {
        var tooltipData = angular.element("<div>")
          .addClass('tooltip-info')
          .text(scope.simpleTooltip);
        element.addClass("tooltip-target")
          .append(tooltipData);

      },
    };
  });
});

