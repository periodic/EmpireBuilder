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

    baseCityCost: 1000,
    baseFoodRequirement: 100 / 1.3,
    baseDistance: 100,

    initialMoney: 100,
    initialExploration: 0,

    distanceFudgeFactor: 0.1,

    baseModifierChance: 0.5,
    baseModifierStrength: 0.10,

    baseExplorationCost: 100,
    baseExplorationDistance: 20,

    growthFactors: {
      buildingCost: 1.5,
      cityCost: 4.0,
      explorationCost: 1.3,
      foodCost: 1.4,

      upgrade: 2.0,
      explorationDistance: 1.2,
    },
  };
});
