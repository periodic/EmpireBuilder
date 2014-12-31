define(['angular', 'data/constants'], function (_) {
  console.log("Registering game service.");
  function Game($interval, Buildings, Constants) {
    this.Buildings = Buildings;
    this.Constants = Constants;
    this.cities = [new City("City 1")];
    this.money = 100;
    this.moneyPerSecond = 0;

    $interval(angular.bind(this, this.perTick), Constants.updateDelay);
  };

  Game.prototype.purchaseBuilding = function (cityId, buildingId) {
    var city = this.cities[cityId];
    var building = this.Buildings[buildingId];

    if (this.money >= building.cost) {
      city.AddBuilding(buildingId);
      this.money = this.money - building.cost;
    }
  };

  Game.prototype.perTick = function () {
    var moneyDelta = 0;

    this.cities.forEach(angular.bind(this, function (city) {
      console.log("Checking city", city);
      Object.keys(city.buildings).forEach(angular.bind(this, function (buildingId) {
        console.log("Checking building", buildingId);
        var building = this.Buildings[buildingId];
        var count = city.buildings[buildingId];
        moneyDelta = moneyDelta + building.moneyPerSecond(count, city, this);
      }));
    }));

    console.log("Got delta: ", moneyDelta);
    this.money = this.money + moneyDelta * this.Constants.updateDelay / 1000;
  };

  function City(name) {
    this.name = name;
    this.population = 1;
    this.buildings = {};
  };

  City.prototype.AddBuilding = function (buildingId) {
    var count = this.buildings[buildingId] || 0;
    this.buildings[buildingId] = count + 1;
  };

  var m = angular.module('EB.Game', ['EB.Constants']);
  m.service('game', Game);

  console.log("Game service registered.");
});
