define(['angular', 'data/constants'], function (_) {

  function CityController($scope, $state, $stateParams, game) {
    $scope.cityController = this;

    this.game = game;
    this.cityId = $stateParams['cityId'];
    this.city = game.getCity(this.cityId);
    if (!this.city) {
      console.log("City is not found.", this);
      $state.go('cities');
    }
  };

  CityController.prototype.getBuildings = function () {
    return this.game.getBuildings();
  };

  CityController.prototype.getBuildingCount = function(buildingId) {
    return this.city.numBuildings(buildingId);
  };

  CityController.prototype.getBuildingCost = function(buildingId) {
    return this.game.buildingCost(buildingId, this.cityId);
  };

  CityController.prototype.getBuildingProfit = function(buildingId) {
    return this.game.buildingProfit(buildingId, this.cityId, this.getBuildingCount(buildingId));
  };

  CityController.prototype.getProfitPerBuilding = function(buildingId) {
    return this.game.buildingProfit(buildingId, this.cityId, 1);
  };

  CityController.prototype.purchase = function (buildingId) {
    this.game.purchaseBuilding(this.cityId, buildingId);
  };

  var m = angular.module('EB.Controllers.CityController', []);
  m.controller('CityController', CityController);
});
