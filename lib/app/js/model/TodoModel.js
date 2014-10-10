define(function (require) {
    'use strict';

    var Model = require('backbone').Model;

    /**
     * @class    TodoModel
     * @extends {Backbone.Model}
     */
    var TodoModel = Model.extend({

        defaults: {
            done: false,
            title: ''
        },

        toggleDone: function () {
            this.set('done', !this.get('done'));
            return this;
        }
    });

    return TodoModel;
});