require.config({
  paths: {
    'angular': "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.28/angular",
    'uirouter': "http://angular-ui.github.io/ui-router/release/angular-ui-router",
  },
  shim: {
    'uirouter': {
      deps: ['angular'],
    }
  }
});

require(['angular', 'EmpireBuilder'], function () {
  angular.bootstrap(document, ['EB']);
});
