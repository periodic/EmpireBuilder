define([], function () {
  function numBuildings(buildingIds) {
    return function (game) {
      return buildingIds.reduce(function (sum, buildingId) {
        return sum + game.numBuildings(buildingId);
      }, 0);
    };
  };

  function numCities() {
    return function (game) {
      return game.numCities();
    };
  };

  var foodBuildings = ["food1", "food2", "food3", "food4", "food5"];
  var exploreBuildings = ["explore1", "explore2", "explore3", "explore4", "explore5"];
  var moneyBuildings = ["money1", "money2", "money3", "money4", "money5"];

  return [
    {
      id: "city1",
      name: "It's a free country",
      description: "Build 1 additional city.",
      points: 1,
      metric: numCities(),
      goal: 2,
    },
    {
      id: "city2",
      name: "Industrial strength",
      description: "Have 5 cities.",
      points: 10,
      metric: numCities(),
      goal: 5,
    },
    {
      id: "city3",
      name: "Vim and vigour",
      description: "Build 10 cities.",
      points: 20,
      metric: numCities(),
      goal: 10,
    },
    {
      id: "city4",
      name: "Larger than life",
      description: "Build 50 cities.",
      points: 100,
      metric: numCities(),
      goal: 50,
    },

    {
      id: "food1",
      name: "Digging in",
      description: "Build 5 food-production buildings.",
      points: 1,
      metric: numBuildings(foodBuildings),
      goal: 5,
    },
    {
      id: "food2",
      name: "Buying the farm",
      description: "Build 20 food-production buildings.",
      points: 2,
      metric: numBuildings(foodBuildings),
      goal: 50,
    },
    {
      id: "food3",
      name: "The cream of the crop",
      description: "Build 50 food-production buildings.",
      points: 5,
      metric: numBuildings(foodBuildings),
      goal: 100,
    },
    {
      id: "food4",
      name: "Covering a lot of ground",
      description: "Build 100 food-production buildings.",
      points: 10,
      metric: numBuildings(foodBuildings),
      goal: 500,
    },

    {
      id: "money1",
      name: "Easy money",
      description: "Build 5 money-production buildings.",
      points: 1,
      metric: numBuildings(moneyBuildings),
      goal: 5,
    },
    {
      id: "money2",
      name: "A consumers dozen",
      description: "Build 12 money-production buildings.",
      points: 2,
      metric: numBuildings(moneyBuildings),
      goal: 50,
    },
    {
      id: "money3",
      name: "Go for broke",
      description: "Build 50 money-production buildings.",
      points: 5,
      metric: numBuildings(moneyBuildings),
      goal: 100,
    },
    {
      id: "money4",
      name: "Breaking the bank",
      description: "Build 100 money-production buildings.",
      points: 10,
      metric: numBuildings(moneyBuildings),
      goal: 500,
    },

    {
      id: "explore1",
      name: "Setting Out",
      description: "Build 5 exploration buildings.",
      points: 1,
      metric: numBuildings(exploreBuildings),
      goal: 5,
    },
    {
      id: "explore2",
      name: "Over the Hill",
      description: "Build 20 exploration buildings.",
      points: 2,
      metric: numBuildings(exploreBuildings),
      goal: 50,
    },
    {
      id: "explore3",
      name: "Across the Sea",
      description: "Build 50 exploration buildings.",
      points: 5,
      metric: numBuildings(exploreBuildings),
      goal: 100,
    },
    {
      id: "explore4",
      name: "Mapping the World",
      description: "Build 100 exploration buildings.",
      points: 10,
      metric: numBuildings(exploreBuildings),
      goal: 500,
    },

    /*
    {
      id: "farm1",
      name: "Digging in",
      description: "Build 5 farms.",
      points: 1,
      metric: numBuildings('farm'),
      goal: 5,
    },
    {
      id: "farm2",
      name: "Buying the farm",
      description: "Build 50 farms.",
      points: 2,
      metric: numBuildings('farm'),
      goal: 50,
    },
    {
      id: "farm3",
      name: "The cream of the crop",
      description: "Build 100 farms.",
      points: 3,
      metric: numBuildings('farm'),
      goal: 100,
    },
    {
      id: "farm4",
      name: "Covering a lot of ground",
      description: "Build 500 farms.",
      points: 4,
      metric: numBuildings('farm'),
      goal: 500,
    },
    {
      id: "workshop1",
      name: "All in a days work",
      description: "Build 5 workshops.",
      points: 1,
      metric: numBuildings('workshop'),
      goal: 5,
    },
    {
      id: "workshop2",
      name: "Grunt work",
      description: "Build 50 workshops.",
      points: 2,
      metric: numBuildings('workshop'),
      goal: 50,
    },
    {
      id: "workshop3",
      name: "A little work never hurt anyone",
      description: "Build 100 workshops.",
      points: 3,
      metric: numBuildings('workshop'),
      goal: 100,
    },
    {
      id: "workshop4",
      name: "All work and no play",
      description: "Build 500 workshops.",
      points: 4,
      metric: numBuildings('workshop'),
      goal: 500,
    },
    {
      id: "market1",
      name: "Feeding the masses",
      description: "Build 5 markets.",
      points: 1,
      metric: numBuildings('market'),
      goal: 5,
    },
    {
      id: "market2",
      name: "A consumers dozen",
      description: "Build 50 markets.",
      points: 2,
      metric: numBuildings('market'),
      goal: 50,
    },
    {
      id: "market3",
      name: "Humble pie",
      description: "Build 100 markets.",
      points: 3,
      metric: numBuildings('market'),
      goal: 100,
    },
    {
      id: "market4",
      name: "Let them eat cake",
      description: "Build 500 markets.",
      points: 4,
      metric: numBuildings('market'),
      goal: 500,
    },
    {
      id: "school1",
      name: "Roll call",
      description: "Build 5 schools.",
      points: 1,
      metric: numBuildings('school'),
      goal: 5,
    },
    {
      id: "school2",
      name: "'A' for effort",
      description: "Build 50 schools.",
      points: 2,
      metric: numBuildings('school'),
      goal: 50,
    },
    {
      id: "school3",
      name: "Too cool for school",
      description: "Build 100 schools.",
      points: 3,
      metric: numBuildings('school'),
      goal: 100,
    },
    {
      id: "school4",
      name: "Higher education",
      description: "Build 500 schools.",
      points: 4,
      metric: numBuildings('school'),
      goal: 500,
    },
    {
      id: "bank1",
      name: "Easy money",
      description: "Build 5 banks.",
      points: 1,
      metric: numBuildings('bank'),
      goal: 5,
    },
    {
      id: "bank2",
      name: "Cash cow",
      description: "Build 50 banks.",
      points: 2,
      metric: numBuildings('bank'),
      goal: 50,
    },
    {
      id: "bank3",
      name: "Go for broke",
      description: "Build 100 banks.",
      points: 3,
      metric: numBuildings('bank'),
      goal: 100,
    },
    {
      id: "bank4",
      name: "Breaking the bank",
      description: "Build 500 banks.",
      points: 4,
      metric: numBuildings('bank'),
      goal: 500,
    },
    */
  ];
});

//game.cities.length
