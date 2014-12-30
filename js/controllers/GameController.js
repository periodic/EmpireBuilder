define(['angular'], function () {

  function GameController($scope) {
    $scope.value = "foo";
  }

  console.log('Creating GameController.');

  angular.module('EmpireBuilder.GameController', [])
      .controller('GameController', GameController);
});

