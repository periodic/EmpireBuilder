define(['data/constants'], function (Constants) {
  function Game($interval) {
    $interval(angular.bind(this, this.perTick), Constants.updateDelay);
    $interval(angular.bind(this, this.saveState), Constants.saveDelay);

    this.achievementsAvailable = [];
    this.achievementsAcquired = [];
    this.achievementScore = 0;

    this.cities = [];

    this.money = 0;
    this.moneyPerSecond = 0;
    this.goldMultiplier = 1.0;

    // upgradeId -> count
    this.upgradesPurchased_ = {};
    // buildingId -> modified building
    this.buildingsById_ = {}

    if (localStorage.game) {
      this.loadState();
    } else {
      this.reset();
    }
  };

  Game.prototype.reset = function () {
    console.log("Resetting game.");
    this.achievementsAvailable = Constants.achievements;
    this.achievementsAcquired = [];
    this.achievementScore = 0;

    this.cities = [];

    this.money = Constants.initialMoney;
    this.moneyPerSecond = 0;
    this.goldMultiplier = 1.0;

    // Private
    this.upgradesPurchased_ = {};
    this.buildings_ = [];
    this.buildingsById_ = {}
    Constants.buildings.forEach(function (building) {
      var b = {};
      b.__proto__ = building;
      this.buildings_.push(b);
      this.buildingsById_[building.id] = b;
    }, this);

    this.buildCity();
  };

  Game.prototype.getCity = function (cityId) {
    return cityId < this.cities.length ? this.cities[cityId] : undefined;
  };

  Game.prototype.getBuilding = function (buildingId) {
    return this.buildingsById_[buildingId];
  };

  // Returns the list of buildings.
  Game.prototype.getBuildings = function () {
    return this.buildings_;
  };

  Game.prototype.numBuildings = function (buildingId) {
    return this.cities.reduce(function (sum, city) {
      return sum + city.numBuildings(buildingId);
    }, 0);
  };

  Game.prototype.numCities = function () {
    return this.cities.length;
  };

  Game.prototype.purchaseBuilding = function (cityId, buildingId) {
    var city = this.cities[cityId];
    var cost = this.buildingCost(buildingId, cityId);

    if (this.money >= cost) {
      city.addBuilding(buildingId);
      this.money = this.money - cost;
    }

    this.checkAchievements();
  };

  Game.prototype.purchaseCity = function () {
    var cost = this.cityCost();

    if (this.money >= cost) {
      this.money = this.money - cost;
      this.buildCity();
      return this.cities.length - 1;
    }

    return -1;
  };

  Game.prototype.buildCity = function () {
    var city = new City();
    city.name = this.generateCityName();
    // d = base * (growth^cities - 1)
    city.distance = Constants.baseDistance *
        (Math.pow(Constants.growthFactors.distance, this.cities.length) - 1);
    // d = d * (1 ± fudge)
    city.distance = city.distance *
        ((Math.random() * 2 - 1) * Constants.distanceFudgeFactor + 1);
    city.distanceCostModifier = city.distance / Constants.baseDistance + 1;

    // p = 1 - (1 - p) / (1 + m), m > 1
    var modifierChance = 1 - (1 - Constants.baseModifierChance) / city.distanceCostModifier;
    while (Math.random() < modifierChance) {
      var modifierIndex = Math.floor(Math.random() * Constants.cityModifiers.length);
      var modifier = Constants.cityModifiers[modifierIndex];
      city.modifiers.push({
        id: modifier.id,
        strength: Math.random() * Constants.baseModifierStrength *
                  city.distanceCostModifier,
      });
    };

    city.calculateModifiers();
    this.cities.push(city);

    this.checkAchievements();
  };

  Game.prototype.generateCityName = function () {
    var index = Math.floor(Math.random() * Constants.cityNames.length);
    var name = Constants.cityNames[index].name;
    Constants.cityNames.slice(index, 1);
    return name;
  };

  Game.prototype.perTick = function () {
    var moneyDelta = 0;

    this.cities.forEach(function (city, cityId) {
      var cityMoneyDelta = 0;

      Constants.buildings.forEach(function (building) {
        var count = city.numBuildings(building.id);
        var delta = this.buildingProfit(building.id, cityId, count);

        moneyDelta = moneyDelta + delta * this.goldMultiplier;
        cityMoneyDelta = cityMoneyDelta + delta * this.goldMultiplier;
      }, this);

      city.moneyPerTurn = cityMoneyDelta;
    }, this);

    this.moneyPerSecond = moneyDelta;
    this.money = this.money + moneyDelta * Constants.updateDelay / 1000;
    this.checkAchievements();
  };

  Game.prototype.trueCost = function (base, count, growthFactor) {
    return base * Math.pow(growthFactor, count);
  };

  Game.prototype.buildingCost = function (buildingId, cityId) {
    var building = this.buildingsById_[buildingId];
    var city = this.cities[cityId];
    return city.costMultiplier *
        this.trueCost(building.cost,
                      city.numBuildings(buildingId),
                      Constants.growthFactors.building);
  };

  Game.prototype.buildingProfit = function (buildingId, cityId, count) {
    var building = this.buildingsById_[buildingId];
    var city = this.cities[cityId];
    return city.goldMultiplier *
        this.goldMultiplier *
        building.moneyPerSecond(count, city, this);
  };

  Game.prototype.cityCost = function () {
    return this.trueCost(
        Constants.baseCityCost,
        this.cities.length - 1,
        Constants.growthFactors.cityCost);
  };

  Game.prototype.upgradeCost = function (upgradeId) {
    var upgrade = Constants.upgradesById[upgradeId];
    return this.trueCost(
        upgrade.cost,
        (this.upgradesPurchased_[upgradeId] || 0),
        Constants.growthFactors.upgrade);
  }

  Game.prototype.upgradesAvailable = function () {
    return Constants.upgrades.filter(function (upgrade) {
      // if it has a max and we've reached it, it's not available.
      return !upgrade.max || upgrade.max > (this.upgradesPurchased_[upgrade.id] || 0);
    }, this);
  };

  Game.prototype.upgradesPurchased = function () {
    return Object.keys(this.upgradesPurchased_).map(function (upgradeId) {
      return {
          upgrade: Constants.upgradesById[upgradeId],
          purchased: this.upgradesPurchased_[upgradeId],
      };
    }, this);
  };

  Game.prototype.purchaseUpgrade = function (upgradeId) {
    var alreadyPurchased = this.upgradesPurchased_[upgradeId] || 0;
    var upgrade = Constants.upgradesById[upgradeId];
    var cost = this.upgradeCost(upgradeId);
    if (! upgrade || (upgrade.max && upgrade.max <= alreadyPurchased)) {
      return;
    }

    if (this.money < cost) {
      return;
    }

    this.money = this.money - cost;
    this.upgradesPurchased_[upgradeId] = alreadyPurchased + 1;

    upgrade.onPurchase(this);

    this.checkAchievements();
  };

  Game.prototype.checkAchievements = function () {
    var available = [];
    this.achievementsAvailable.forEach(function (achievement) {
      if (achievement.metric(this) >= achievement.goal) {
        this.achievementsAcquired.push(achievement);
        this.achievementScore = this.achievementScore + achievement.points;
        console.log("Achieved:", achievement);
      } else {
        available.push(achievement);
      }
    }, this);

    this.achievementsAvailable = available;
  };

  Game.prototype.getState = function () {
    var achievements = this.achievementsAcquired.map(function (achievement) {
      return achievement.id;
    });
    var cities = this.cities.map(function (city) {
      return city.getState();
    });
    return {
      money: this.money,
      upgrades: this.upgradesPurchased_,
      achievements: achievements,
      achievementScore: this.achievementScore,
      cities: cities,
    };
  };

  Game.prototype.setState = function (state) {
    this.money = state.money;

    this.buildingsById_ = {};
    this.buildings_ = [];
    Constants.buildings.forEach(function (building) {
      var b = {};
      b.__proto__ = building;
      this.buildings_.push(b);;
      this.buildingsById_[building.id] = b;
    }, this);

    Object.keys(state.upgrades).forEach(function (upgradeId) {
      this.upgradesPurchased_[upgradeId] = state.upgrades[upgradeId];
      var upgrade = Constants.upgradesById[upgradeId];
      for (var i = 0; i < this.upgradesPurchased_[upgradeId]; i++) {
        upgrade.onPurchase(this);
      }
    }, this);

    this.achievementScore = state.achievementScore;
    this.achievementsAcquired = [];
    this.achievementsAvailable = [];
    Constants.achievements.forEach(function (achievement) {
      if (state.achievements.indexOf(achievement.id) >= 0) {
        this.achievementsAcquired.push(achievement);
      } else {
        this.achievementsAvailable.push(achievement);
      }
    }, this);

    this.cities = state.cities.map(function (cityState) {
      var city = new City();
      city.setState(cityState);
      return city;
    });
  };

  Game.prototype.saveState = function () {
    localStorage.game = JSON.stringify(this.getState());
  };

  Game.prototype.loadState = function () {
    console.log("Loading state.");
    var state = JSON.parse(localStorage.game);
    this.setState(state);
  };

  Game.prototype.resetState = function () {
    delete localStorage.game;
    this.reset();
  };

  function City() {
    this.name = "";
    this.population = 1;
    this.distance = 0;
    this.distanceCostModifier = 1.0;
    this.buildings = {}; // buildingId -> count
    this.modifiers = [];

    // Dynamic properties.
    this.goldMultiplier = 1.0;
    this.costMultiplier = 1.0;
    this.moneyPerTurn = 0;

    this.calculateModifiers();
  };

  City.prototype.calculateModifiers = function () {
    this.costMultiplier = this.distanceCostModifier;
    this.goldMultiplier = 1.0;

    this.modifiers.forEach(function (modifierInfo) {
      var modifier = Constants.cityModifiersById[modifierInfo.id];
      if (! modifier) {
        console.log("City has unknown modifier:", modifierInfo.id);
        return;
      }
      var costMult = modifierInfo.strength * modifier.costMultiplier + 1;
      this.costMultiplier = this.costMultiplier * costMult;

      var goldMult = modifierInfo.strength * modifier.goldMultiplier + 1;
      this.goldMultiplier = this.goldMultiplier * goldMult;
    }, this);
  };

  City.prototype.totalBuildings = function () {
    var total = 0;
    Object.keys(this.buildings).forEach(function (buildingId) {
      total = total + this.buildings[buildingId];
    }, this);
    return total;
  };

  City.prototype.numBuildings = function (buildingId) {
    return this.buildings[buildingId] || 0;
  };

  City.prototype.addBuilding = function (buildingId) {
    var count = this.buildings[buildingId] || 0;
    this.buildings[buildingId] = count + 1;
  };

  City.prototype.getState = function () {
    return {
      name: this.name,
      population: this.population,
      distance: this.distance,
      distanceCostModifier: this.distanceCostModifier,
      buildings: this.buildings,
      modifiers: this.modifiers,
    };
  };

  City.prototype.setState = function (state) {
    this.name = state.name;
    this.population = state.population;
    this.distance = state.distance;
    this.distanceCostModifier = state.distanceCostModifier;
    this.buildings = state.buildings;
    this.modifiers = state.modifiers;

    this.calculateModifiers();
  };

  return Game;
});
