define(['angular', 'data/constants'], function (_) {
  console.log("Registering game service.");
  function Game($interval, Buildings, Constants) {
    this.Buildings = Buildings;
    this.Constants = Constants;
    this.cities = [new City("City 1")];
    this.money = Constants.initialMoney;
    this.moneyPerSecond = 0;

    $interval(angular.bind(this, this.perTick), Constants.updateDelay);
  };

  Game.prototype.getCity = function (cityId) {
    return cityId < this.cities.length ? this.cities[cityId] : undefined;
  };

  Game.prototype.purchaseBuilding = function (cityId, buildingId) {
    var city = this.cities[cityId];
    var cost = this.buildingCost(buildingId, city.numBuildings(buildingId));

    if (this.money >= cost) {
      city.addBuilding(buildingId);
      this.money = this.money - cost;
    }
  };

  Game.prototype.purchaseCity = function () {
    var cost = this.cityCost();

    if (this.money >= cost) {
      this.cities.push(new City("New City"));
      this.money = this.money - cost;
    }

    return this.cities.length - 1;
  };

  Game.prototype.perTick = function () {
    var moneyDelta = 0;

    this.cities.forEach(angular.bind(this, function (city) {
      var cityMoneyDelta = 0;
      Object.keys(city.buildings).forEach(angular.bind(this, function (buildingId) {
        var building = this.Buildings[buildingId];
        var count = city.buildings[buildingId];
        var delta = building.moneyPerSecond(count, city, this);
        moneyDelta = moneyDelta + delta
        cityMoneyDelta = cityMoneyDelta + delta;
      }));
      city.moneyPerTurn = cityMoneyDelta;
    }));

    this.moneyPerSecond = moneyDelta;
    this.money = this.money + moneyDelta * this.Constants.updateDelay / 1000;
  };

  Game.prototype.trueCost = function (base, count, growthFactor) {
    return base * Math.pow(growthFactor, count);
  };

  Game.prototype.buildingCost = function (buildingId, count) {
    var building = this.Buildings[buildingId];
    return this.trueCost(building.cost, count, this.Constants.growthFactors.building);
  };

  Game.prototype.cityCost = function () {
    return this.trueCost(
        this.Constants.baseCityCost,
        this.cities.length - 1,
        this.Constants.growthFactors.city);
  };

  function City(name) {
    this.name = name;
    this.population = 1;
    this.moneyPerTurn = 0;
    this.buildings = {};
  };

  City.prototype.totalBuildings = function () {
    return Object.keys(this.buildings).length;
  };

  City.prototype.numBuildings = function (buildingId) {
    return this.buildings[buildingId] || 0;
  };

  City.prototype.addBuilding = function (buildingId) {
    var count = this.buildings[buildingId] || 0;
    this.buildings[buildingId] = count + 1;
  };

  var m = angular.module('EB.Game', ['EB.Constants']);
  m.service('game', Game);

  console.log("Game service registered.");
});
