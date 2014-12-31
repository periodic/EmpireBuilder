define(['angular', 'data/buildings'], function (_) {

  var m = angular.module('EB.Constants', [
    'EB.Buildings',
  ]);

  m.constant('Constants', {
    updateDelay: 100, // ms
    baseCityCost: 10,
    growthFactors: {
      building: 1.2,
      city: 2.0,
    },
  });

});
