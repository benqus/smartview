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

        setTitle: function (title) {
            return this.set('title', title);
        },

        toggleDone: function () {
            return this.set('done', !this.get('done'));
        }
    });

    return TodoModel;
});