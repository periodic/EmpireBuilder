define(['angular'], function () {

  function UpgradesController($scope, $state, game) {
    $scope.upgradesController = this;

    this.$state = $state;
    this.game = game;

    this.upgradesAvailable = game.upgradesAvailable();
    this.upgradesPurchased = game.upgradesPurchased();
  };

  UpgradesController.prototype.purchase = function (upgradeId) {
    console.log("purchasing ", upgradeId);
    this.game.purchaseUpgrade(upgradeId);

    this.upgradesAvailable = this.game.upgradesAvailable();
    this.upgradesPurchased = this.game.upgradesPurchased();
  };

  var m = angular.module('EB.Controllers.UpgradesController', []);
  m.controller('UpgradesController', UpgradesController);
});


