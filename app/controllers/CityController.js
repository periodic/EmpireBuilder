define(['angular'], function () {

  function CityController($scope, $state, $stateParams, game, Buildings) {
    $scope.cityController = this;
    $scope.Buildings = Buildings;

    this.game = game;
    this.cityId = $stateParams['cityId'];
    this.city = game.getCity(this.cityId);
    if (!this.city) {
      console.log("City is not found.", this);
      $state.go('cities');
    }
  }

  CityController.prototype.getBuildingCost = function(buildingId) {
    return this.game.buildingCost(buildingId, this.cityId);
  }

  CityController.prototype.getBuildingCount = function(buildingId) {
    return this.city.buildings[buildingId] || 0;
  }

  CityController.prototype.getBuildingProfit = function(buildingId) {
    var building = this.game.getBuilding(buildingId);
    return building.moneyPerSecond(this.getBuildingCount(buildingId), this.city, this.game);
  }

  CityController.prototype.getProfitPerBuilding = function(buildingId) {
    var building = this.game.getBuilding(buildingId);
    return building.moneyPerSecond(1, this.city, this.game);
  }

  CityController.prototype.purchase = function (buildingId) {
    this.game.purchaseBuilding(this.cityId, buildingId);
  };

  var m = angular.module('EB.Controllers.CityController', []);
  m.controller('CityController', CityController);
});
