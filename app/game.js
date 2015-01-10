define(['data/constants'], function (Constants) {

  function trueCost(base, count, growthFactor) {
    return base * Math.pow(growthFactor, count);
  };

  function Game($interval) {
    $interval(angular.bind(this, this.perTick), Constants.updateDelay);
    $interval(angular.bind(this, this.saveState), Constants.saveDelay);

    this.reset();

    if (localStorage.game) {
      this.loadState();
    } else {
      this.newGame();
    }
  };

  Game.prototype.reset = function () {
    console.log("Resetting game.");

    // Game State
    this.achievementsAvailable = Constants.achievements;
    this.achievementsAcquired = [];
    this.achievementScore = 0;

    this.cities = [];
    this.sites = [];

    this.money = Constants.initialMoney;
    this.exploration = 0;
    this.nextExplorationCost = Constants.baseExplorationCost;

    this.upgradesPurchased_ = {}; // upgradeId -> count

    this.moneyPerSecond = 0;
    this.moneyMultiplier = 1.0;

    this.explorationPerSecond = 0;
    this.explorationMultiplier = 1.0;

    this.foodMultiplier = 1.0;

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
  };

  Game.prototype.newGame = function () {
    var capitolSite = this.makeCapitolSite();
    this.buildCity(capitolSite);
  }

  Game.prototype.numCities = function () { return this.cities.length; };
  Game.prototype.getCities = function () { return this.cities; };
  Game.prototype.getCity = function (cityId) { return this.cities[cityId]; };
  Game.prototype.getCapitol = function () { return this.cities[0]; };

  Game.prototype.numSites = function () { return this.sites.length; };
  Game.prototype.hasSites = function () { return this.sites.length > 0; };
  Game.prototype.getSites = function () { return this.sites };
  Game.prototype.getSite = function (siteId) { return this.sites[siteId]; };

  Game.prototype.getBuilding = function (buildingId) { return this.buildingsById_[buildingId]; };
  Game.prototype.getBuildings = function () { return this.buildings_; };
  Game.prototype.numBuildings = function (buildingId) {
    return this.cities.reduce(function (sum, city) {
      return sum + city.numBuildings(buildingId);
    }, 0);
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

  Game.prototype.purchaseCity = function (siteIndex) {
    var cost = this.cityCost();
    if (this.money >= cost) {
      var site = this.sites.splice(siteIndex, 1)[0];
      this.money = this.money - cost;
      this.buildCity(site);
      return this.cities.length - 1;
    }
    return -1;
  };

  Game.prototype.purchaseSite = function () {
    if (this.exploration >= this.nextExplorationCost) {
      this.sites.push(this.buildSite());
      this.exploration = this.exploration - this.nextExplorationCost;
      this.nextExplorationCost = this.nextExplorationCost * Constants.growthFactors.exploration;
    }
  };

  Game.prototype.buildSite = function () {
    var site = new Site();

    // d = base * (growth^cities - 1)
    site.distance = Constants.baseDistance *
        (Math.pow(Constants.growthFactors.distance, this.cities.length) - 1);
    // d = d * (1 ± fudge)
    site.distance = site.distance *
        ((Math.random() * 2 - 1) * Constants.distanceFudgeFactor + 1);
    site.distanceCostModifier = site.distance / Constants.baseDistance + 1;

    // Allocate a random amount of mod strength, then use the same formula to
    // create mods.  As long as they remain under the total strength we
    // allocate.
    var totalModStrength = Math.random() * Constants.baseModifierStrength * site.distanceCostModifier;
    while (totalModStrength > 0) {
      var modifierIndex = Math.floor(Math.random() * Constants.cityRandomModifiers.length);
      var modifierId = Constants.cityRandomModifiers[modifierIndex];

      var strength = Math.random() *
                     Constants.baseModifierStrength *
                     site.distanceCostModifier;
      if (strength <= totalModStrength) {
        site.addModifier(modifierId, strength);
      }
      totalModStrength = totalModStrength - strength;
    };

    return site;
  };

  Game.prototype.buildCity = function (site) {
    var city = new City();
    city.name = this.generateCityName();
    city.site = site;
    this.cities.push(city);
    this.updateCapitolStrength();
    this.checkAchievements();
  };

  Game.prototype.makeCapitolSite = function () {
    var capitolSite = new Site();
    capitolSite.addModifier('capitol', this.cities.length);
    return capitolSite;
  };

  Game.prototype.updateCapitolStrength = function () {
    if (!this.getCapitol()) {
      return;
    }
    this.getCapitol().getModifiers().forEach(function (modifierInfo) {
      if (modifierInfo.id == 'capitol') {
        modifierInfo.strength = this.cities.length;
      }
    }, this);
    this.getCapitol().site.calculateModifiers();
  };

  Game.prototype.generateCityName = function () {
    var index = Math.floor(Math.random() * Constants.cityNames.length);
    var name = Constants.cityNames[index].name;
    Constants.cityNames.slice(index, 1);
    return name;
  };

  Game.prototype.perTick = function () {
    var moneyDelta = 0;
    var explorationDelta = 0;

    this.cities.forEach(function (city, cityId) {
      var cityMoneyDelta = city.site.moneyBonus;
      var cityExplorationDelta = city.site.explorationBonus;
      var cityFoodDelta = city.site.foodBonus;

      Object.keys(this.buildingsById_).forEach(function (buildingId) {
        var building = this.getBuilding(buildingId);
        var buildingCount = city.numBuildings(buildingId);
        var workerCount = city.numWorkers(buildingId);

        // Add unworked bonuses
        cityMoneyDelta = cityMoneyDelta + buildingCount *
                         (building.moneyPerSecond || 0);
        cityExplorationDelta = cityExplorationDelta + buildingCount *
                               (building.explorationPerSecond || 0);
        cityFoodDelta = cityFoodDelta + buildingCount *
                        (building.foodPerSecond || 0);

        // Add worked bonuses.
        cityMoneyDelta = cityMoneyDelta + workerCount * (building.moneyPerSecondWorked || 0);
        cityExplorationDelta = cityExplorationDelta + workerCount *
                               (building.explorationPerSecondWorked || 0);
        cityFoodDelta = cityFoodDelta + workerCount * (building.foodPerSecondWorked || 0);
      }, this);

      cityMoneyDelta = cityMoneyDelta * city.moneyMultiplier * this.moneyMultiplier;
      cityExplorationDelta = cityExplorationDelta * city.explorationMultiplier *
                             this.explorationMultiplier;
      cityFoodDelta = cityFoodDelta * city.foodMultiplier * this.foodMultiplier;

      city.moneyPerSecond = cityMoneyDelta;
      city.explorationPerSecond = cityExplorationDelta;
      city.foodPerSecond = cityFoodDelta;

      // Add food to city.
      city.food = city.food + cityFoodDelta * Constants.updateDelay / 1000;
      city.checkForGrowth();

      // Update globals
      moneyDelta = moneyDelta + cityMoneyDelta;
      explorationDelta = explorationDelta + cityExplorationDelta;
    }, this);

    this.moneyPerSecond = moneyDelta;
    this.explorationPerSecond = explorationDelta;

    // Add money and exploration to the bank.
    this.money = this.money + moneyDelta * Constants.updateDelay / 1000;
    this.exploration = this.exploration + explorationDelta * Constants.updateDelay / 1000;

    this.checkAchievements();
  };

  Game.prototype.siteCost = function () {
    return this.nextExplorationCost;
  };

  Game.prototype.buildingCost = function (buildingId, cityId) {
    var building = this.buildingsById_[buildingId];
    var city = this.cities[cityId];
    return city.costMultiplier *
        trueCost(building.cost,
                 city.numBuildings(buildingId),
                 Constants.growthFactors.building);
  };

  Game.prototype.buildingProfit = function (buildingId, cityId, count) {
    var building = this.buildingsById_[buildingId];
    var city = this.cities[cityId];
    return building.moneyPerSecond *
        count *
        city.moneyMultiplier *
        this.moneyMultiplier;
  };

  Game.prototype.cityCost = function () {
    return trueCost(
        Constants.baseCityCost,
        this.cities.length - 1,
        Constants.growthFactors.cityCost);
  };

  Game.prototype.upgradeCost = function (upgradeId) {
    var upgrade = Constants.upgradesById[upgradeId];
    return trueCost(
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

    if (this.achievementScore < cost) {
      return;
    }

    this.achievementScore = this.achievementScore - cost;
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
    var sites = this.sites.map(function (site) {
      return site.getState();
    });
    return {
      money: this.money,
      exploration: this.exploration,
      nextExplorationCost: this.nextExplorationCost,
      upgrades: this.upgradesPurchased_,
      achievements: achievements,
      achievementScore: this.achievementScore,
      cities: cities,
      sites: sites,
    };
  };

  Game.prototype.setState = function (state) {
    this.money = state.money || 0;
    this.exploration = state.exploration || 0;
    this.nextExplorationCost = state.nextExplorationCost || 0;

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
      if (city.hasModifier('capitol')) {
        this.capitol = city;
      }
      return city;
    }, this);
    this.updateCapitolStrength();

    this.sites = state.sites.map(function (siteState) {
      var site = new Site();
      site.setState(siteState);
      return site;
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
    this.newGame();
  };

  function City() {
    this.name = "";

    this.food = 0;
    this.population = 1;

    this.distanceCostModifier = 1.0;

    this.buildings = {}; // buildingId -> count
    this.workers = {}; // buildingId -> count

    this.site = new Site();

    // Dynamic properties.
    this.costMultiplier = 1.0;

    this.moneyPerSecond = 0;
    this.explorationPerSecond = 0;
    this.foodPerSecond = 0;
  };

  Object.defineProperties(City.prototype, {
    costMultiplier: { get: function () { return this.site.costMultiplier; }, },
    distance: { get: function () { return this.site.distance; }, },
    distanceCostModifier: { get: function () { return this.site.distanceCostModifier; }, },
    moneyBonus: { get: function () { return this.site.moneyBonus; }, },
    moneyMultiplier: { get: function () { return this.site.moneyMultiplier; }, },
    explorationBonus: { get: function () { return this.site.explorationBonus; }, },
    explorationMultiplier: { get: function () { return this.site.explorationMultiplier; }, },
    foodBonus: { get: function () { return this.site.foodBonus; }, },
    foodMultiplier: { get: function () { return this.site.foodMultiplier; }, },
  });

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

  City.prototype.numWorkers = function (buildingId) {
    return this.workers[buildingId] || 0;
  };

  City.prototype.totalWorking = function () {
    var sum = 0;
    Object.keys(this.workers).forEach(function (buildingId) {
      sum += this.workers[buildingId];
    }, this);
    return sum;
  };

  City.prototype.numUnemployed = function (buildingId) {
    return this.population - this.totalWorking();
  };

  City.prototype.addBuilding = function (buildingId) {
    var count = this.buildings[buildingId] || 0;
    this.buildings[buildingId] = count + 1;

    if (this.totalWorking() < this.population) {
      this.addWorker(buildingId);
    }
  };

  City.prototype.getModifiers = function () {
    return this.site.getModifiers();
  };

  City.prototype.addModifier = function (modifierId, strength) {
    this.site.addModifier(modifierId, strength);
  };

  City.prototype.hasModifier = function (modifierId) {
    return this.site.hasModifier(modifierId);
  };

  City.prototype.isCapitol = function () {
    return this.hasModifier("capitol");
  };

  City.prototype.foodRequired = function () {
    return trueCost(Constants.baseFoodRequirement, this.population,
                    Constants.growthFactors.food);
  };

  City.prototype.checkForGrowth = function () {
    if (this.food > this.foodRequired()) {
      this.population = this.population + 1;
      this.food = 0;
    }
  };

  City.prototype.addWorker = function (buildingId) {
    if (this.totalWorking() < this.population &&
        this.numWorkers(buildingId) < this.numBuildings(buildingId)) {
      this.workers[buildingId] = this.numWorkers(buildingId) + 1;
      console.log("Adding worker to: ", buildingId, this);
    }
  };

  City.prototype.removeWorker = function (buildingId) {
    if (this.numWorkers(buildingId) > 0) {
      console.log("Removing worker to: ", buildingId, this);
      this.workers[buildingId]--;
    }
  };

  City.prototype.getState = function () {
    return {
      name: this.name,
      population: this.population,
      food: this.food,
      distanceCostModifier: this.distanceCostModifier,
      workers: this.workers,
      buildings: this.buildings,
      site: this.site.getState(),
    };
  };

  City.prototype.setState = function (state) {
    this.name = state.name;

    this.population = state.population;
    this.food = state.food;

    this.distanceCostModifier = state.distanceCostModifier;

    this.buildings = state.buildings;
    this.workers = state.workers;

    this.site = new Site();
    this.site.setState(state.site);
  };

  function Site() {
    this.distance = 0;
    this.distanceCostModifier = 1.0;
    this.modifiers = [];

    // Dynamic properties.
    this.costMultiplier = 1.0;

    this.moneyBonus = 0.0;
    this.moneyMultiplier = 1.0;

    this.explorationBonus = 0.0;
    this.explorationMultiplier = 1.0;

    this.foodBonus = 0.0;
    this.foodMultiplier = 1.0;

    this.calculateModifiers();
  };

  Site.prototype.calculateModifiers = function () {
    this.moneyBonus = 0;
    this.explorationBonus = 0;
    this.foodBonus = 0;

    this.costMultiplier = this.distanceCostModifier;
    this.moneyMultiplier = 1.0;
    this.explorationMultiplier = 1.0;
    this.foodMultiplier = 1.0;

    this.modifiers.forEach(function (modifierInfo) {
      var modifier = Constants.cityModifiersById[modifierInfo.id];
      if (! modifier) {
        console.log("Site has unknown modifier:", modifierInfo.id);
        return;
      }
      this.costMultiplier = this.costMultiplier *
          modifierInfo.strength *
          (modifier.costMultiplier || 0) + 1;
      this.moneyMultiplier = this.moneyMultiplier *
          modifierInfo.strength *
          (modifier.moneyMultiplier || 0) + 1;
      this.explorationMultiplier = this.explorationMultiplier *
          modifierInfo.strength *
          (modifier.explorationMultiplier || 0) + 1;
      this.foodMultiplier = this.foodMultiplier *
          modifierInfo.strength *
          (modifier.foodMultiplier || 0) + 1;

      this.moneyBonus = this.moneyBonus + (modifier.moneyBonus || 0) * modifierInfo.strength;
      this.explorationBonus = this.explorationBonus + (modifier.explorationBonus || 0) *
          modifierInfo.strength;
      this.foodBonus = this.foodBonus + (modifier.foodBonus || 0) * modifierInfo.strength;
    }, this);
  };

  Site.prototype.getModifiers = function () {
    return this.modifiers;
  };

  Site.prototype.addModifier = function (modifierId, strength) {
    var matchingMods = this.modifiers.filter(function (modifierInfo) {
      return modifierInfo.id == modifierId;
    });

    if (matchingMods.length > 0) {
      matchingMods[0].strength = matchingMods[0].strength + strength;
    } else {
      this.modifiers.push({
        id: modifierId,
        strength: strength,
      });
    }

    this.calculateModifiers();
  };

  Site.prototype.hasModifier = function (modifierId) {
    return this.modifiers.some(function (modifierInfo) {
      return modifierInfo.id == modifierId;
    });
  };

  Site.prototype.getState = function () {
    return {
      distance: this.distance,
      distanceCostModifier: this.distanceCostModifier,
      modifiers: this.modifiers,
    };
  };

  Site.prototype.setState = function (state) {
    this.distance = state.distance;
    this.distanceCostModifier = state.distanceCostModifier;
    this.modifiers = state.modifiers;

    this.calculateModifiers();
  };

  return Game;
});
