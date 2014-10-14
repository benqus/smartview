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

        /**
         * @override
         * TODO: this is ugly since but only for the sake of the example app
         */
        save: function () {
            this.collection.save();
            return this;
        },

        /**
         * @param   {string} title
         * @returns {Backbone.Model}
         */
        setTitle: function (title) {
            return this.set('title', title);
        },

        /**
         * @returns {Backbone.Model}
         */
        toggleDone: function () {
            return this.set('done', !this.get('done'));
        }
    });

    return TodoModel;
});