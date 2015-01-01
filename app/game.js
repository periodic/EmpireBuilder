define(['data/constants'], function (Constants) {
  function Game($interval) {
    $interval(angular.bind(this, this.perTick), Constants.updateDelay);
    $interval(angular.bind(this, this.saveState), Constants.saveDelay);

    // Game State
    this.achievementsAcquired = [];
    this.achievementScore = 0;

    this.cities = [];
    this.sites = [];
    this.money = 0;
    this.exploration = 0;
    this.nextExplorationCost = 0;

    this.upgradesPurchased_ = {}; // upgradeId -> count

    // Dynamic properties
    this.achievementsAvailable = [];

    this.moneyPerSecond = 0;
    this.moneyMultiplier = 1.0;

    this.explorationPerSecond = 0;
    this.explorationMultiplier = 1.0;

    this.buildingsById_ = {}; // buildingId -> modified building

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
    this.sites = [];

    this.money = Constants.initialMoney;
    this.moneyPerSecond = 0;
    this.moneyMultiplier = 1.0;

    this.exploration = 0;
    this.nextExplorationCost = Constants.baseExplorationCost;

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

    var capitolSite = this.makeCapitolSite();
    this.buildCity(capitolSite);
  };

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
      this.updateCapitolStrength();
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

    this.checkAchievements();
  };

  Game.prototype.makeCapitolSite = function () {
    var capitolSite = new Site();
    capitolSite.addModifier('capitol', this.cities.length);
    return capitolSite;
  };

  Game.prototype.updateCapitolStrength = function () {
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
      var cityMoneyDelta = city.site.moneyBonus *
          this.moneyMultiplier;
      var cityExplorationDelta = city.site.explorationBonus *
          this.explorationMultiplier;

      Constants.buildings.forEach(function (building) {
        var count = city.numBuildings(building.id);
        var delta = this.buildingProfit(building.id, cityId, count);

        cityMoneyDelta = cityMoneyDelta + delta * this.moneyMultiplier;
        cityexplorationDelta = cityExplorationDelta + delta * this.explorationMultiplier;
      }, this);

      city.moneyPerSecond = cityMoneyDelta;
      city.explorationPerSecond = cityExplorationDelta;

      moneyDelta = moneyDelta + cityMoneyDelta;
      explorationDelta = explorationDelta + cityExplorationDelta;
    }, this);

    this.moneyPerSecond = moneyDelta;
    this.explorationPerSecond = explorationDelta;

    this.money = this.money + moneyDelta * Constants.updateDelay / 1000;
    this.exploration = this.exploration + explorationDelta * Constants.updateDelay / 1000;

    this.checkAchievements();
  };

  Game.prototype.trueCost = function (base, count, growthFactor) {
    return base * Math.pow(growthFactor, count);
  };

  Game.prototype.siteCost = function () {
    return this.nextExplorationCost;
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
    return city.site.moneyMultiplier *
        this.moneyMultiplier *
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
    var sites = this.sites.map(function (site) {
      return site.getState();
    });
    return {
      money: this.money,
      exploration: this.exploration,
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
  };

  function City() {
    this.name = "";
    this.population = 1;
    this.distanceCostModifier = 1.0;
    this.buildings = {}; // buildingId -> count
    this.site = new Site();

    // Dynamic properties.
    this.costMultiplier = 1.0;

    this.moneyBonus = 0.0;
    this.moneyMultiplier = 1.0;

    this.explorationBonus = 0.0;
    this.explorationMultiplier = 1.0;

    this.moneyPerSecond = 0;
    this.explorationPerSecond = 0;
  };

  Object.defineProperties(City.prototype, {
    costMultiplier: { get: function () { return this.site.costMultiplier; }, },
    distance: { get: function () { return this.site.distance; }, },
    distanceCostModifier: { get: function () { return this.site.distanceCostModifier; }, },
    moneyBonus: { get: function () { return this.site.moneyBonus; }, },
    moneyMultiplier: { get: function () { return this.site.moneyMultiplier; }, },
    explorationBonus: { get: function () { return this.site.explorationBonus; }, },
    explorationMultiplier: { get: function () { return this.site.explorationMultiplier; }, },
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

  City.prototype.addBuilding = function (buildingId) {
    var count = this.buildings[buildingId] || 0;
    this.buildings[buildingId] = count + 1;
  };

  City.prototype.getModifiers = function () {
    return this.site.getModifiers();
  };

  City.prototype.addModifier = function (modifierId, strength) {
    this.site.addModifier(modifierId, strength);
  };

  City.prototype.hasModifier = function (modifierId) {
    this.site.hasModifier(modifierId);
  };

  City.prototype.getState = function () {
    return {
      name: this.name,
      population: this.population,
      distance: this.distance,
      distanceCostModifier: this.distanceCostModifier,
      buildings: this.buildings,
      site: this.site.getState(),
    };
  };

  City.prototype.setState = function (state) {
    this.name = state.name;
    this.population = state.population;
    this.buildings = state.buildings;

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

    this.calculateModifiers();
  };

  Site.prototype.calculateModifiers = function () {
    this.costMultiplier = this.distanceCostModifier;
    this.moneyMultiplier = 1.0;

    this.modifiers.forEach(function (modifierInfo) {
      var modifier = Constants.cityModifiersById[modifierInfo.id];
      if (! modifier) {
        console.log("Site has unknown modifier:", modifierInfo.id);
        return;
      }
      var costMult = modifierInfo.strength * (modifier.costMultiplier || 0) + 1;
      this.costMultiplier = this.costMultiplier * costMult;

      var moneyMult = modifierInfo.strength * (modifier.moneyMultiplier || 0) + 1;
      this.moneyMultiplier = this.moneyMultiplier * moneyMult;

      var explorationMult = modifierInfo.strength * (modifier.explorationMultiplier || 0) + 1;
      this.explorationMultiplier = this.explorationMultiplier * explorationMult;

      this.moneyBonus = this.moneyBonus + (modifier.moneyBonus || 0)
      this.explorationBonus = this.explorationBonus + (modifier.explorationBonus || 0)
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
