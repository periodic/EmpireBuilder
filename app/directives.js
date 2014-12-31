define(['angular', 'directives/buildings', 'directives/cities'], function (_) {
  var m = angular.module('EB.Directives', [
    'EB.Directives.Buildings',
    'EB.Directives.Cities',
  ]);
});
