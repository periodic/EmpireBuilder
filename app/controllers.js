define([
  'angular',
  'controllers/CityController',
  'controllers/GameController',
], function () {
  angular.module('EB.Controllers', [
    'EB.Controllers.CityController',
    'EB.Controllers.GameController',
    ]);
});
