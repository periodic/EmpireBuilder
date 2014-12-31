define([
  'angular',
  'uirouter',
  'data/constants',
  'directives',
  'filters',
  'game',
  'controllers'], function (_) {
    console.log("Creating EB module.");
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
      .state("city", {
        url: "/city",
        templateUrl: "app/views/city.html",
        controller: function ($scope, game) {
          $scope.game = game;
        },
      })
      .state("city.detail", {
        url: "/detail/:cityId",
        templateUrl: "app/views/city-detail.html",
        controller: 'CityController',
      })
    });
    console.log("EB module created.");
});
