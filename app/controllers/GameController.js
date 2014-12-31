define(['angular'], function () {

  function GameController($scope, $state, game) {
    $scope.gameController = this;

    this.$state = $state;
    this.game = game;

    $scope.$on('select-city', angular.bind(this, this.onSelectCity));
    $scope.$on('purchaseCity', angular.bind(this, this.onPurchaseCity));
  };

  GameController.prototype.onShowCities = function (event) {
    this.$state.go('city');
  };

  GameController.prototype.onShowUpgrades = function (event) {
    this.$state.go('upgrades');
  };

  GameController.prototype.onSelectCity = function (event, cityId) {
    event.stopPropagation();

    this.$state.go('city.detail', {cityId: cityId});
  };

  GameController.prototype.onPurchaseCity = function (event) {
    event.stopPropagation();

    var cityId = this.game.purchaseCity();

    this.$state.go('city.detail', {cityId: cityId});
  };

  var m = angular.module('EB.Controllers.GameController', []);

  m.controller('GameController', GameController);
});

