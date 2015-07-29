'use strict';
require('angular-ui-router');
require('angular-material');

var modulename = 'important';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var common = require('../common')(namespace);
    var crazy = require('../crazy')(namespace);
    var app = angular.module(fullname, ['ui.router', 'ngMaterial', common.name, crazy.name]);
    // inject:folders start
    // inject:folders end

    var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
    var configRoutes = function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            template: require('./views/home.html')
        });
    };
    configRoutes.$inject = configRoutesDeps;
    app.config(configRoutes);

    return app;
};
