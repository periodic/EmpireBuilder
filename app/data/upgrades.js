define([], function () {
  return [
    {
      id: "water-tech",
      name: "Water Tech",
      description: "Improves farms by 20%.",
      cost: 1,
      onPurchase: function (game) {
        var building = game.getBuilding('farm');
        building.baseMoneyPerSecond = building.baseMoneyPerSecond * 1.2;
      },
    },
    {
      id: "wonder",
      name: "One-Point Wonder",
      description: "Increases all gold generation by 20%.  Can only be purchased once.",
      cost: 10,
      max: 1,
      onPurchase: function (game) {
        game.goldMultiplier = game.goldMultiplier + 0.2;
      },
    },
  ];
});
