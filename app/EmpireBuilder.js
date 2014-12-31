define([
  'angular',
  'uirouter',
  'data/constants',
  'directives',
  'filters',
  'game',
  'controllers'], function (_) {
  angular.module('EB', [
    'ui.router',
    'EB.Constants',
    'EB.Controllers',
    'EB.Directives',
    'EB.Filters',
    'EB.Game',
    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/city");

      $stateProvider
      .state("cities", {
        url: "/cities",
        templateUrl: "app/views/cities.html",
        controller: function ($scope, game) {
          $scope.game = game;
        },
      })
      .state("cities.detail", {
        url: "/detail/:cityId",
        templateUrl: "app/views/city-detail.html",
        controller: 'CityController',
      })
      .state("upgrades", {
        url: "/upgrades",
        templateUrl: "app/views/upgrades.html",
        controller: 'UpgradesController',
      })
      .state("achievements", {
        url: "/achievements",
        templateUrl: "app/views/achievements.html",
        controller: 'AchievementsController',
      })
      .state("settings", {
        url: "/settings",
        templateUrl: "app/views/settings.html",
        controller: 'SettingsController',
      })
    });
});
