define([], function () {
  /*
   * Building
   *
   * id: A unique ID for the building.
   * name: The name displayed for the building.
   * description: The description displayed for the building.
   * cost: The cost in gold to purchase the building.
   * moneyPerSecond: The money provided per second.
   * foodPerSecond: The food provided per second.
   * explorationPerSecond: The exploration provided per second.
   * moneyPerSecondWorked: Additional money provided per second when this building is worked.
   * foodPerSecondWorked: Additional food provided per second when this building is worked.
   * explorationPerSecondWorked: Additional exploration provided per second when this building is worked.
   */

  return [
    {
      id: "explorersGuild",
      name: "Explorer's Guild",
      description: "They go out and find stuff.",
      cost: 10,
      explorationPerSecond: 0.1,
      explorationPerSecondWorked: 0.9,
    },
    {
      id: "farm",
      name: "Farm",
      description: "Has goats, chickens, and a variety of crops.",
      cost: 5,
      foodPerSecond: 0.1,
      foodPerSecondWorked: 0.9,
    },
    {
      id: "workshop",
      name: "Workshop",
      description: "A shop that has tools and machinery where things are made and fixed.",
      cost: 30,
      moneyPerSecond: 1,
      moneyPerSecondWorked: 2,
    },
    {
      id: "market",
      name: "Market",
      description: "A place for puchase and sale of provisions, livestock and other goods.",
      cost: 180,
      moneyPerSecond: 3,
      moneyPerSecondWorked: 6,
    },
    {
      id: "school",
      name: "School",
      description: "An instituion of learning.",
      cost: 1080,
      moneyPerSecond: 9,
      moneyPerSecondWorked: 18,
    },
    {
      id: "bank",
      name: "Bank",
      description: "Show me the money.",
      cost: 6480,
      moneyPerSecond: 27,
      moneyPerSecondWorked: 54,
    },
  ];
});
