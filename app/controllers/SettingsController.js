define(['angular'], function () {

  function SettingsController($scope, game) {
    $scope.settingsController = this;

    this.game = game;
  };

  SettingsController.prototype.resetGame = function () {
    this.game.resetState();
  };

  var m = angular.module('EB.Controllers.SettingsController', []);
  m.controller('SettingsController', SettingsController);
});



