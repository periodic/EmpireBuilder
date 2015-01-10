define(['angular'], function () {

  function GameController($scope, $state, game) {
    $scope.gameController = this;

    this.$state = $state;
    this.game = game;

    // TODO: Stop using events.
    $scope.$on('select-city', angular.bind(this, this.onSelectCity));
    $scope.$on('purchase-city', angular.bind(this, this.onPurchaseCity));
  };

  GameController.prototype.onShowCities = function () {
    this.$state.go('cities');
  };

  GameController.prototype.onShowUpgrades = function () {
    this.$state.go('upgrades');
  };

  GameController.prototype.onShowAchievements = function () {
    this.$state.go('achievements');
  };

  GameController.prototype.onShowSettings = function () {
    this.$state.go('settings');
  };

  GameController.prototype.onSelectCity = function (event, cityId) {
    event.stopPropagation();

    this.selectCity(cityId);
  };

  GameController.prototype.selectCity = function (cityId) {
    console.log("Selecting city ", cityId);
    this.$state.go('cities.detail', {cityId: cityId});
  };

  GameController.prototype.onPurchaseCity = function (event) {
    console.log("Purchasing city.");
    event.stopPropagation();

    var cityId = this.game.purchaseCity();

    this.$state.go('cities.detail', {cityId: cityId});
  };

  GameController.prototype.buildCities = function () {
    this.$state.go('cities.build');
  };

  var m = angular.module('EB.Controllers.GameController', []);

  m.controller('GameController', GameController);
});

