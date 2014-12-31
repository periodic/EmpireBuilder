define(['angular', 'data/buildings', 'data/upgrades'], function (_) {

  var m = angular.module('EB.Constants', [
    'EB.Buildings',
    'EB.Upgrades',
  ]);

  m.constant('Constants', {
    updateDelay: 100, // ms
    baseCityCost: 10,
    initialMoney: 1000,
    growthFactors: {
      building: 1.2,
      city: 2.0,
      upgrade: 1.5,
    },
  });

});
