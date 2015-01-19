define([], function () {
  /*
   * Building
   *
   * id: A unique ID for the building.
   * name: The name displayed for the building.
   * description: The description displayed for the building.
   * cost: The cost in money to purchase the building.
   * moneyPerSecond: The money provided per second.
   * foodPerSecond: The food provided per second.
   * explorationPerSecond: The exploration provided per second.
   * moneyPerSecondWorked: Additional money provided per second when this building is worked.
   * foodPerSecondWorked: Additional food provided per second when this building is worked.
   * explorationPerSecondWorked: Additional exploration provided per second when this building is worked.
   */

  function grow(base, growthFactor, n) {
    return base * Math.pow(growthFactor, n);
  }

  // Exploration buildings.
  // Cost Growth: x5
  // Production Growth: x2
  var expCostBase = 100;
  var expCostGrowth = 5.0;
  var expProductionBase = 0.1;
  var expProductionGrowth = 1.5;
  var expWorkedBase = 0.25;
  var expWorkedGrowth = 2.0;

  // Food buildings
  // Cost Growth: x5
  // Production Growth: x3
  var foodCostBase = 50;
  var foodCostGrowth = 5.0;
  var foodProductionBase = 0.1;
  var foodProductionGrowth = 3.0;
  var foodWorkedBase = 1.0;
  var foodWorkedGrowth = 3.0;

  // Money buildings
  // Cost Growth: x5
  // Production Growth: x4
  var moneyCostBase = 75;
  var moneyCostGrowth = 5.0;
  var moneyProductionBase = 0.1;
  var moneyProductionGrowth = 4.0;
  var moneyWorkedBase = 1.0;
  var moneyWorkedGrowth = 4.0;

  return [
    // Exploration Buildings
    {
      id: "explore1",
      name: "Outfitter",
      description: "Outfits expeditions that are venturing out to explore the world.",
      cost: grow(expCostBase, expCostGrowth, 0),
      explorationPerSecond: grow(expProductionBase, expProductionGrowth, 0),
      explorationPerSecondWorked: grow(expWorkedBase, expWorkedGrowth, 0),
    },
    {
      id: "explore2",
      name: "Explorer's Guild",
      description: "They go out and find stuff.",
      cost: grow(expCostBase, expCostGrowth, 1),
      explorationPerSecond: grow(expProductionBase, expProductionGrowth, 1),
      explorationPerSecondWorked: grow(expWorkedBase, expWorkedGrowth, 1),
    },
    {
      id: "explore3",
      name: "Explorer's Guild 2",
      description: "They go out and find stuff.",
      cost: grow(expCostBase, expCostGrowth, 2),
      explorationPerSecond: grow(expProductionBase, expProductionGrowth, 2),
      explorationPerSecondWorked: grow(expWorkedBase, expWorkedGrowth, 2),
    },
    {
      id: "explore4",
      name: "Explorer's Guild 3",
      description: "They go out and find stuff.",
      cost: grow(expCostBase, expCostGrowth, 3),
      explorationPerSecond: grow(expProductionBase, expProductionGrowth, 3),
      explorationPerSecondWorked: grow(expWorkedBase, expWorkedGrowth, 3),
    },
    {
      id: "explore5",
      name: "Explorer's Guild 4",
      description: "They go out and find stuff.",
      cost: grow(expCostBase, expCostGrowth, 4),
      explorationPerSecond: grow(expProductionBase, expProductionGrowth, 4),
      explorationPerSecondWorked: grow(expWorkedBase, expWorkedGrowth, 4),
    },

    // Food Buildings
    {
      id: "food1",
      name: "Pasture",
      description: "Has goats, chickens, and a variety of crops.",
      cost: grow(foodCostBase, foodCostGrowth, 0),
      foodPerSecond: grow(foodProductionBase, foodProductionGrowth, 0),
      foodPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 0),
    },
    {
      id: "food2",
      name: "Orchard",
      description: "Has goats, chickens, and a variety of crops.",
      cost: grow(foodCostBase, foodCostGrowth, 1),
      foodPerSecond: grow(foodProductionBase, foodProductionGrowth, 1),
      foodPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 1),
    },
    {
      id: "food3",
      name: "Farm",
      description: "Has goats, chickens, and a variety of crops.",
      cost: grow(foodCostBase, foodCostGrowth, 2),
      foodPerSecond: grow(foodProductionBase, foodProductionGrowth, 2),
      foodPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 2),
    },
    {
      id: "food4",
      name: "Irrigated Cropland",
      description: "Has goats, chickens, and a variety of crops.",
      cost: grow(foodCostBase, foodCostGrowth, 3),
      foodPerSecond: grow(foodProductionBase, foodProductionGrowth, 3),
      foodPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 3),
    },
    {
      id: "food5",
      name: "Hydroponics",
      description: "Has goats, chickens, and a variety of crops.",
      cost: grow(foodCostBase, foodCostGrowth, 4),
      foodPerSecond: grow(foodProductionBase, foodProductionGrowth, 4),
      foodPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 4),
    },

    // Money buildings
    {
      id: "money1",
      name: "Workshop",
      description: "A shop that has tools and machinery where things are made and fixed.",
      cost: grow(moneyCostBase, foodCostGrowth, 0),
      moneyPerSecond: grow(foodProductionBase, foodProductionGrowth, 0),
      moneyPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 0),
    },
    {
      id: "money2",
      name: "Market",
      description: "A place for puchase and sale of provisions, livestock and other goods.",
      cost: grow(moneyCostBase, foodCostGrowth, 1),
      moneyPerSecond: grow(foodProductionBase, foodProductionGrowth, 1),
      moneyPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 1),
    },
    {
      id: "money3",
      name: "School",
      description: "An instituion of learning.",
      cost: grow(moneyCostBase, foodCostGrowth, 2),
      moneyPerSecond: grow(foodProductionBase, foodProductionGrowth, 2),
      moneyPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 2),
    },
    {
      id: "money5",
      name: "Factory",
      description: "A place for puchase and sale of provisions, livestock and other goods.",
      cost: grow(moneyCostBase, foodCostGrowth, 3),
      moneyPerSecond: grow(foodProductionBase, foodProductionGrowth, 3),
      moneyPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 3),
    },
    {
      id: "money5",
      name: "Bank",
      description: "Show me the money.",
      cost: grow(moneyCostBase, foodCostGrowth, 4),
      moneyPerSecond: grow(foodProductionBase, foodProductionGrowth, 4),
      moneyPerSecondWorked: grow(foodWorkedBase, foodWorkedGrowth, 4),
    },
  ];
});
