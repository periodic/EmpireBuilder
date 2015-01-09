define(['angular'], function () {

  function BuildCityController($scope, $state, game) {
    $scope.buildCityController = this;

    this.game = game;
    this.$state = $state;
  };

  BuildCityController.prototype.buildCost = function () {
    return this.game.cityCost();
  };

  BuildCityController.prototype.hasSites = function () {
    return this.game.hasSites();
  };

  BuildCityController.prototype.getSites = function () {
    return this.game.getSites();
  };

  BuildCityController.prototype.exploreCost = function () {
    return this.game.siteCost();
  };

  BuildCityController.prototype.canExplore = function () {
    return this.exploreCost() <= this.game.exploration;
  };

  BuildCityController.prototype.explore = function () {
    this.game.purchaseSite();
  };

  BuildCityController.prototype.canBuild = function () {
    return this.buildCost() <= this.game.money;
  };

  BuildCityController.prototype.buildCity = function (siteIndex) {
    var cityId = this.game.purchaseCity(siteIndex);
    this.$state.go('cities.detail', {cityId: cityId});
  };

  var m = angular.module('EB.Controllers.BuildCityController', []);

  m.controller('BuildCityController', BuildCityController);
});


