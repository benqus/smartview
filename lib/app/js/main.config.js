(function () {
    'use strict';

    requirejs.config({
        paths: {
            SmartView:   '../../src/SmartView',
            handlebars: '../../../node_modules/handlebars/dist/handlebars',
            underscore: '../../../node_modules/underscore/underscore',
            jquery:     '../../../node_modules/jquery/dist/jquery',
            backbone:   '../../../node_modules/backbone/backbone'
        },

        shim: {
            backbone: {
                deps: ['underscore', 'jquery']
            }
        }
    });

    require(['jquery', 'view/TodoApp'], function ($, App) {
        'use strict';

        var app;

        $(function () {
            app = new App({
                el: document.body
            });

            app.render();
            app.render(); // re-rendering the whole App
            app.render(); // re-rendering the whole App
        });
    });

}());