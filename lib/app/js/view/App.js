define(function (require) {
    'use strict';

    var SmartView = require('SmartView'),
        JobsCollection = require('collection/Jobs'),
        Nav = require('view/Nav');

    /**
     * @class    App
     * @extends {SmartView}
     */
    var App = SmartView.extend({

        tagName: 'section',

        className: 'App',

        mapping: {
            'nav': '.container'
        },

        template: [
            '<h1>App</h1>',
            '<div class="container"></div>'
        ],

        build: function () {
            new Nav({
                    collection: new JobsCollection([
                        { link: '/a', text: 'a' },
                        { link: '/b', text: 'b' },
                        { link: '/c', text: 'c' }
                    ])
                })
                .addTo(this, 'nav');
        }
    });

    return App;
});