define(['angular'], function (_) {
  var m = angular.module('EB.Achievements', []);

  m.constant('Achievements', [
    {
      id: "farm1",
      name: "Digging in",
      description: "Build 5 farms.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['farm'] > 4;
        });
      },
    },
    {
      id: "farm2",
      name: "Buying the farm",
      description: "Build 50 farms.",
      points: 2,
      condition: function (game) {
        return 50 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['farm'];
        }, 0);
      },
    },
    {
      id: "farm3",
      name: "The cream of the crop",
      description: "Build 100 farms.",
      points: 3,
      condition: function (game) {
        return 100 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['farm'];
        }, 0);
      },
    },
    {
      id: "farm4",
      name: "Covering a lot of ground",
      description: "Build 500 farms.",
      points: 4,
      condition: function (game) {
        return 500 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['farm'];
        }, 0);
      },
    },
    {
      id: "workshop1",
      name: "All in a days work",
      description: "Build 5 workshops.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['workshop'] > 4;
        });
      },
    },
    {
      id: "workshop2",
      name: "Grunt work",
      description: "Build 50 workshops.",
      points: 2,
      condition: function (game) {
        return 50 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['workshop'];
        }, 0);
      },
    },
    {
      id: "workshop3",
      name: "A little work never hurt anyone",
      description: "Build 100 workshops.",
      points: 3,
      condition: function (game) {
        return 100 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['workshop'];
        }, 0);
      },
    },
    {
      id: "workshop4",
      name: "All work and no play",
      description: "Build 500 workshops.",
      points: 4,
      condition: function (game) {
        return 500 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['workshop'];
        }, 0);
      },
    },
    {
      id: "market1",
      name: "Feeding the masses",
      description: "Build 5 markets.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['market'] > 4;
        });
      },
    },
    {
      id: "market2",
      name: "A consumers dozen",
      description: "Build 50 markets.",
      points: 2,
      condition: function (game) {
        return 50 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['market'];
        }, 0);
      },
    },
    {
      id: "market3",
      name: "Humble pie",
      description: "Build 100 markets.",
      points: 3,
      condition: function (game) {
        return 100 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['market'];
        }, 0);
      },
    },
    {
      id: "market4",
      name: "Let them eat cake",
      description: "Build 500 markets.",
      points: 4,
      condition: function (game) {
        return 500 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['market'];
        }, 0);
      },
    },
    {
      id: "school1",
      name: "Roll call",
      description: "Build 5 schools.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['school'] > 4;
        });
      },
    },
    {
      id: "school2",
      name: "'A' for effort",
      description: "Build 50 schools.",
      points: 2,
      condition: function (game) {
        return 50 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['school'];
        }, 0);
      },
    },
    {
      id: "school3",
      name: "Too cool for school",
      description: "Build 100 schools.",
      points: 3,
      condition: function (game) {
        return 100 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['school'];
        }, 0);
      },
    },
    {
      id: "school4",
      name: "Higher education",
      description: "Build 500 schools.",
      points: 4,
      condition: function (game) {
        return 500 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['school'];
        }, 0);
      },
    },
    {
      id: "bank1",
      name: "Easy money",
      description: "Build 5 banks.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['bank'] > 4;
        });
      },
    },
    {
      id: "bank2",
      name: "Cash cow",
      description: "Build 50 banks.",
      points: 2,
      condition: function (game) {
        return 50 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['bank'];
        }, 0);
      },
    },
    {
      id: "bank3",
      name: "Go for broke",
      description: "Build 100 banks.",
      points: 3,
      condition: function (game) {
        return 100 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['bank'];
        }, 0);
      },
    },
    {
      id: "bank4",
      name: "Breaking the bank",
      description: "Build 500 banks.",
      points: 4,
      condition: function (game) {
        return 500 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['bank'];
        }, 0);
      },
    },
    {
      id: "city1",
      name: "It's a free country",
      description: "Build 2 cities.",
      points: 1,
      condition: function (game) {
        return 2 <= game.cities.length;
      },
    },
    {
      id: "city2",
      name: "Industrial strength",
      description: "Build 5 cities.",
      points: 1,
      condition: function (game) {
        return 5 <= game.cities.length;
      },
    },
    {
      id: "city3",
      name: "Vim and vigour",
      description: "Build 10 cities.",
      points: 1,
      condition: function (game) {
        return 10 <= game.cities.length;
      },
    },
    {
      id: "city4",
      name: "Larger than life",
      description: "Build 50 cities.",
      points: 1,
      condition: function (game) {
        return 50 <= game.cities.length;
      },
    },
  ]);
});

//game.cities.length