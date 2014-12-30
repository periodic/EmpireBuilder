console.log("configuring");

require.config({
  paths: {
    'angular': "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.28/angular.min",
  },
});

console.log("requiring angular");

require(['angular', 'EmpireBuilder'], function () {
  angular.bootstrap(document, ['EmpireBuilder']);
});
