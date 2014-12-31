define([
  'angular',
  'uirouter',
  'data/constants',
  'directives',
  'game',
  'controllers'], function (_) {
    console.log("Creating EB module.");
  angular.module('EB', [
    'ui.router',
    'EB.Constants',
    'EB.Controllers',
    'EB.Directives',
    'EB.Game',
    ])
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/city");

      $stateProvider
      .state("city", {
        url: "/city",
        templateUrl: "app/views/city.html",
      })
      .state("city.detail", {
        url: "/detail/:cityId",
        templateUrl: "app/views/city-detail.html",
        controller: 'CityController',
      })
    });
    console.log("EB module created.");
});
