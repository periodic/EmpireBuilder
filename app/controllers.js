define([
  'angular',
  'controllers/AchievementsController',
  'controllers/CityController',
  'controllers/GameController',
  'controllers/SettingsController',
  'controllers/UpgradesController',
], function () {
  angular.module('EB.Controllers', [
    'EB.Controllers.AchievementsController',
    'EB.Controllers.CityController',
    'EB.Controllers.GameController',
    'EB.Controllers.SettingsController',
    'EB.Controllers.UpgradesController',
    ]);
});
