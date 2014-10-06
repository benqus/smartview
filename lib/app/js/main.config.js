(function () {
    'use strict';

    requirejs.config({
        paths: {
            baseview:   '../../src/BaseView',
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

    require(['jquery', 'view/App'], function ($, App) {
        'use strict';

        var app;

        $(function () {
            app = new App({
                el: document.body
            });

            app.addNav();
            app.render();
            app.addNav();

        });
    });

}());