define(['angular'], function () {

  function GameController($scope, $state, game) {
    $scope.gameController = this;

    this.$state = $state;
    this.game = game;

    $scope.$on('select-city', angular.bind(this, this.onSelectCity));
  }

  GameController.prototype.onSelectCity = function (event, cityId) {
    event.stopPropagation();

    this.$state.go('city.detail', {cityId: cityId});
  }

  var m = angular.module('EB.Controllers.GameController', []);

  m.controller('GameController', GameController);
});

