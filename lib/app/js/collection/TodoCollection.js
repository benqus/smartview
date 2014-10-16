define(function (require) {
    'use strict';

    var Collection = require('backbone').Collection,
        TodoModel  = require('model/TodoModel');

    /**
     * @class TodoCollection
     * @extends {Backbone.Collection}
     */
    var TodoCollection = Collection.extend({
        model: TodoModel,

        /**
         * @override
         */
        constructor: function () {
            var todos = localStorage.getItem('todos');
            Collection.apply(this, arguments);
            this.reset(JSON.parse(todos));
        },

        /**
         * Binding event listeners
         */
        initialize: function () {
            this.listenTo(this, 'change', this.save);
            this.listenTo(this, 'remove', this.save);
        },

        /**
         * @override
         * TODO: this is ugly since but only for the sake of the example app
         */
        save: function () {
            var json = this.toJSON();
            localStorage.setItem('todos', JSON.stringify(json));
            return this;
        },

        /**
         * Removes the TodoModel specified by a Backbone.Model#cid
         * @param   {string}              cid
         * @returns {Backbone.Collection}
         */
        removeTodo: function (cid) {
            var todo = this.get(cid);
            return this.remove(todo);
        }
    });

    return TodoCollection;
});