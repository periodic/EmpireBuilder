define(['angular'], function (_) {
  var m = angular.module('EB.Achievements', []);

  m.constant('Achievements', [
    {
      id: "farm1",
      name: "Old McDonald",
      description: "Have a farm.",
      points: 1,
      condition: function (game) {
        return game.cities.some(function (city) {
          return city.buildings['farm'] > 0;
        });
      },
    },
    {
      id: "farm2",
      name: "As far as the eye can see",
      description: "Have 5 farms.",
      points: 5,
      condition: function (game) {
        return 5 <= game.cities.reduce(function (sum, city) {
          return sum + city.buildings['farm'];
        }, 0);
      },
    },
  ]);
});
