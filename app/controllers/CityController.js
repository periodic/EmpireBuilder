define(['angular'], function () {

  function CityController($scope, $state, $stateParams, game, Buildings) {
    console.log("CityControler instantiated: ", $stateParams, game);
    $scope.cityController = this;
    $scope.Buildings = Buildings;

    this.game = game;
    this.cityId = $stateParams['cityId'];
    this.city = game.getCity(this.cityId);
    if (!this.city) {
      console.log("City is not found.", this);
      $state.go('city');
    }

    $scope.$on('purchaseBuilding', angular.bind(this, this.onPurchase));
  }

  CityController.prototype.getBuildingCost = function(buildingId) {
    console.log("Getting cost of ", buildingId);
    return this.game.buildingCost(buildingId, this.getBuildingCount(buildingId));
  }

  CityController.prototype.getBuildingCount = function(buildingId) {
    console.log("Getting count of ", buildingId);
    return this.city.buildings[buildingId] || 0;
  }

  CityController.prototype.purchase = function (buildingId) {
    this.game.purchaseBuilding(this.cityId, buildingId);
  };

  var m = angular.module('EB.Controllers.CityController', []);
  m.controller('CityController', CityController);
});
