define([], function () {

  return [
    {
      id: "farm",
      name: "Farm",
      description: "Has goats, chickens, and a variety of crops.",
      cost: 5,
      baseMoneyPerSecond: 1,
      moneyPerSecond: function (count, city, game) {
        return count * this.baseMoneyPerSecond;
      },
    },
    {
      id: "workshop",
      name: "Workshop",
      description: "A shop that has tools and machinery where things are made and fixed.",
      cost: 30,
      baseMoneyPerSecond: 3,
      moneyPerSecond: function (count, city, game) {
        return count * this.baseMoneyPerSecond;
      },
    },
    {
      id: "market",
      name: "Market",
      description: "A place for puchase and sale of provisions, livestock and other goods.",
      cost: 180,
      baseMoneyPerSecond: 9,
      moneyPerSecond: function (count, city, game) {
        return count * this.baseMoneyPerSecond;
      },
    },
    {
      id: "school",
      name: "School",
      description: "An instituion of learning.",
      cost: 1080,
      baseMoneyPerSecond: 27,
      moneyPerSecond: function (count, city, game) {
        return count * this.baseMoneyPerSecond;
      },
    },
    {
      id: "bank",
      name: "Bank",
      description: "Show me the money.",
      cost: 6480,
      baseMoneyPerSecond: 81,
      moneyPerSecond: function (count, city, game) {
        return count * this.baseMoneyPerSecond;
      },
    },
  ];
});
