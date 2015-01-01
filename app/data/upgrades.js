define(['angular'], function (_) {
  var m = angular.module('EB.Upgrades', []);

  m.constant('Upgrades', {
    'water-tech': {
      id: "water-tech",
      name: "Water Tech",
      description: "Improves farms by 20%.",
      cost: 100,
      onPurchase: function (game) {
        var building = game.getBuilding('farm');
        building.baseMoneyPerSecond = building.baseMoneyPerSecond * 1.2;
      },
    },
    wonder: {
      id: "wonder",
      name: "One-Point Wonder",
      description: "Increases all gold generation by 20%.  Can only be purchased once.",
      cost: 1000,
      max: 1,
      onPurchase: function (game) {
        game.goldMultiplier = game.goldMultiplier + 0.2;
      },
    },
  });
});
