define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        SmartView = require('SmartView'),
        TodoCollection = require('collection/TodoCollection'),
        TodoList = require('view/TodoList');

    /**
     * @class    App
     * @extends {SmartView}
     */
    var App = SmartView.extend({

        tagName: 'section',

        className: 'App',

        router: new Backbone.Router(),

        mapping: {
            'nav': '.container'
        },

        template: [
            '<h1>App</h1>',
            '<div class="container"></div>'
        ],

        build: function () {
            new TodoList({
                    collection: new TodoCollection([])
                })
                .addTo(this, 'nav');
        }
    });

    return App;
});