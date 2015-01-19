define([], function () {
  return [
    {
      id: "foodtech1",
      name: "Animal Husbandry",
      description: "Improves food production by 5%.",
      cost: 1,
      max: 1,
      onPurchase: function (game) {
        game.foodMultiplier *= 1.05;
      },
    },
    {
      id: "foodtech2",
      name: "Irrigation",
      description: "Improves food production by 10%.",
      cost: 2,
      max: 1,
      onPurchase: function (game) {
        game.foodMultiplier *= 1.10;
      },
    },
    {
      id: "foodtech2",
      name: "Crop Rotation",
      description: "Improves food production by 15%.",
      cost: 4,
      max: 1,
      onPurchase: function (game) {
        game.foodMultiplier *= 1.15;
      },
    },

    {
      id: "moneytech1",
      name: "Accounting",
      description: "Improves profits by 5%.",
      cost: 1,
      max: 1,
      onPurchase: function (game) {
        game.moneyMultiplier *= 1.05;
      },
    },
    {
      id: "moneytech2",
      name: "Banking",
      description: "Improves profits by 10%.",
      cost: 2,
      max: 1,
      onPurchase: function (game) {
        game.moneyMultiplier *= 1.10;
      },
    },
    {
      id: "moneytech2",
      name: "Investment",
      description: "Improves profits by 15%.",
      cost: 4,
      max: 1,
      onPurchase: function (game) {
        game.moneyMultiplier *= 1.15;
      },
    },

    {
      id: "exploretech1",
      name: "Cartography",
      description: "Improves exploration by 5%.",
      cost: 1,
      max: 1,
      onPurchase: function (game) {
        game.exploreMultiplier *= 1.05;
      },
    },
    {
      id: "exploretech2",
      name: "Compass",
      description: "Improves exploration by 10%.",
      cost: 2,
      max: 1,
      onPurchase: function (game) {
        game.exploreMultiplier *= 1.10;
      },
    },
    {
      id: "exploretech2",
      name: "Astronomy & Navigation",
      description: "Improves exploration by 15%.",
      cost: 4,
      max: 1,
      onPurchase: function (game) {
        game.exploreMultiplier *= 1.15;
      },
    },
  ];
});
