'use strict';
require('angular-ui-router');
require('angular-material');

var modulename = 'common';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var crazy = require('../crazy')(namespace);
    var important = require('../important')(namespace);
    var app = angular.module(fullname, ['ui.router', 'ngMaterial', crazy.name, important.name]);
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
