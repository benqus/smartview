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

        createTodo: function (title, done) {
            return this.add({
                title: title,
                done: done
            });
        },

        removeTodo: function (cid) {
            var todo = this.get(cid);
            return this.remove(todo);
        }
    });

    return TodoCollection;
});