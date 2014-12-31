define(['angular', 'data/buildings'], function (_) {

  var m = angular.module('EB.Constants', [
    'EB.Buildings',
  ]);

  m.constant('Constants', {
    updateDelay: 1000, // ms
    growthFactors: {
      building: 1.2,
      city: 2.0,
    },
  });

});
