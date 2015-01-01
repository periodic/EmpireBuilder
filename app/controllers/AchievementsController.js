define(['angular'], function () {

  function AchievementsController($scope, game) {
    $scope.achievementsController = this;

    this.game = game;
  };

  AchievementsController.prototype.getMetric = function (achievement) {
    return achievement.metric(this.game) 
  };

  var m = angular.module('EB.Controllers.AchievementsController', []);
  m.controller('AchievementsController', AchievementsController);
});


