'use strict';
var gulp = require('gulp');
var esprima = require('esprima');
var inject = require('gulp-inject');
var gutil = require('gulp-util');
var printit = require('gulp-print');
var debug = require('gulp-debug');
var gintercept = require('gulp-intercept');
var fs = require('fs');
var runSequence = require('run-sequence');
var gtap = require('gulp-tap');
var change = require('gulp-change');

var str = '';
var modules = [];

function arrNoDupe(arr) {
    var temp = {};
    for (var i = 0; i < arr.length; i++) {
        temp[arr[i]] = true;
    }
    var r = [];
    for (var k in temp) {
        r.push(k);
    }
    return r;
}

function getModules(module) {

    return gulp.src('./client/scripts/' + module + '/index.js')
        .pipe(debug({
            title: 'unicorn:'
        }))
        .pipe(gtap(function(file, t) {
            var JsonTree = esprima.parse(file.contents.toString());
            //console.log(JSON.stringify(JsonTree, null, 2));
            var monArbre = JSON.parse(JSON.stringify(JsonTree, null, 2));

            function createTreeModule(o, parent, grand, index) {
                for (var i in o) {
                    if (typeof o[i] != 'object') {
                        if (i === 'name' && o[i] === 'require') {
                            // var re = new RegExp('\.\/\+');
                            var rep = new RegExp('\.\.\/(.*)');
                            if (rep.test((parent.arguments[0].value))) {
                                // console.log(rep.exec((parent.arguments[0].value)));
                                //console.log('----------je plote str :---------' + str);
                                str += '\n' + module + ' -> ' + rep.exec((parent.arguments[0].value))[1];
                            }

                        }
                    }
                    if (o[i] !== null && typeof o[i] == 'object') {
                        //going on step down in the object tree!!
                        createTreeModule(o[i], o, parent, index + 1);
                    }
                }
            }
            createTreeModule(monArbre, null, null, 0);
            console.log('********Je plote le str final*******' + '\n' + str + '\n' + '******');
        }));

}

gulp.task('target', function() {

    return gulp.src(['./client/**/main-*.js', '!./client/**/*test.js'])
        .pipe(debug({
            title: 'unicorn:'
        }))
        .pipe(gtap(function(file, t) {
            // console.log(file.contents.toString());
            //var JsonTree = JSON.stringify(esprima.parse(file.contents.toString()), null, 4);
            // var JsonTree = esprima.parse(file.contents.toString());
            // console.log(JSON.stringify(JsonTree));

            var JsonTree = esprima.parse(file.contents.toString());
            var monArbre = JSON.parse(JSON.stringify(JsonTree, null, 2));

            //-----------Save File Name---------
            var fileName = file.path;
            var rep = new RegExp('main-(.*)\.js');
            if (rep.test(fileName)) {
                fileName = rep.exec(fileName)[1];
            }

            function createTree(o, parent, grand, index) {
                for (var i in o) {
                    if (typeof o[i] != 'object') {
                        if (i === 'name' && o[i] === 'require') {
                            // var re = new RegExp('\.\/\+');
                            var rep = new RegExp('\.\/(.*)');
                            if (rep.test((parent.arguments[0].value))) {
                                var module = rep.exec((parent.arguments[0].value))[1];
                                str += '\n' + fileName + ' -> ' + module;
                                modules.push(module);
                                // getModules(module);
                            }

                        }
                    }

                    if (o[i] !== null && typeof o[i] == 'object') {
                        //going on step down in the object tree!!
                        createTree(o[i], o, parent, index + 1);
                    }
                }
            }
            createTree(monArbre, null, null, 0);
            modules = arrNoDupe(modules);
            str += '\n ------------ \n';

        }));

});

gulp.task('module', ['target'], function() {
    for (var i = 0; i < modules.length; i++) {
        getModules(modules[i]);
    }

});

gulp.task('synthesis', ['module'], function() {

});

gulp.task('graph', function() {
    runSequence('synthesis');
});

gulp.task('default', ['synthesis']);
