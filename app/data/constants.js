define([
  'data/achievements',
  'data/buildings',
  'data/cities',
  'data/upgrades'], function (
    Achievements,
    Buildings,
    Cities,
    Upgrades) {

  function createIdMap(array) {
    var map = {};
    array.forEach(function (elem) {
      map[elem.id] = elem;
    });
    return map;
  };

  return {
    achievements: Achievements,
    achievementsById: createIdMap(Achievements),
    buildings: Buildings,
    buildingsById: createIdMap(Buildings),
    cityNames: Cities.names,
    cityRandomModifiers: Cities.randomModifiers,
    cityModifiers: Cities.modifiers,
    cityModifiersById: createIdMap(Cities.modifiers),
    upgrades: Upgrades,
    upgradesById: createIdMap(Upgrades),

    updateDelay: 100, // ms
    saveDelay: 1000, // ms
    baseCityCost: 10,
    initialMoney: 25,
    baseDistance: 100,
    distanceFudgeFactor: 0.1,
    baseModifierChance: 0.5,
    baseModifierStrength: 0.10,
    baseExplorationCost: 100,

    growthFactors: {
      building: 1.2,
      cityCost: 2.0,
      upgrade: 1.5,
      distance: 1.2,
      exploration: 1.5,
    },
  };
});
