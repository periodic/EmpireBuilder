define(['angular', 'data/achievements', 'data/buildings', 'data/cities', 'data/upgrades'], function (_) {

  var m = angular.module('EB.Constants', [
    'EB.Achievements',
    'EB.Buildings',
    'EB.CityNames',
    'EB.Upgrades',
  ]);

  m.constant('Constants', {
    updateDelay: 100, // ms
    saveDelay: 1000, // ms
    baseCityCost: 10,
    initialMoney: 50,
    growthFactors: {
      building: 1.2,
      cityCost: 2.0,
      upgrade: 1.5,
      cityBuildings: 1.2,
    },
  });

});
