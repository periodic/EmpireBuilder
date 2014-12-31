define(['angular'], function () {

  function CityController($scope, $state, $stateParams, game) {
    console.log("CityControler instantiated: ", $stateParams, game);
    $scope.cityController = this;

    this.game = game;
    this.cityId = $stateParams['cityId'];
    this.city = game.getCity(this.cityId);
    if (!this.city) {
      console.log("City is not found.", this);
      $state.go('city');
    }

    $scope.$on('purchaseBuilding', angular.bind(this, this.onPurchase));
  }

  CityController.prototype.onPurchase = function (event, buildingId) {
    event.stopPropagation();
    this.game.purchaseBuilding(this.cityId, buildingId);
  };

  var m = angular.module('EB.Controllers.CityController', []);
  m.controller('CityController', CityController);
});
