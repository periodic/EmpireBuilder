define(['angular'], function (_) {
  var m = angular.module('EB.Buildings', []);

  m.constant('Buildings', {
    farm: {
      id: "farm",
      name: "Farm",
      description: "A farm.",
      cost: 100,
      moneyPerSecond: function (count, city, game) {
        return count * 1;
      },
    },
    workshop: {
      id: "workshop",
      name: "Workshop",
      description: "A workshop.",
      cost: 1000,
      moneyPerSecond: function (count, city, game) {
        return count * 10;
      },
    },
  });
});
