define(function (require) {
    'use strict';

    var SmartView = require('SmartView'),
        TodoItem = require('view/TodoItem');

    /**
     * @class    TodoList
     * @extends {SmartView}
     */
    var TodoList = SmartView.extend({
        tagName: 'nav',
        className: 'TodoList',
        events: {
            'submit form': 'onSubmit'
        },

        mapping: {
            '*': 'ul'
        },

        template: [
            '<ul class="list"></ul>',
            '<form class="create">',
                '<input type="text" class="title" autofocus />',
                '<input type="checkbox" class="done" />',
                '<input type="submit" value="+" />',
            '</form>'
        ],

        modelEvents: ['reset', 'add', 'remove'],

        onSubmit: function (event) {
            event.preventDefault();

            var title = this.$el.find('.create > .title').val(),
                done;

            if (title !== '') {
                done = this.$el.find('.done').is(':checked');
                this.collection.createTodo(title, done);
            }
        },

        build: function () {
            this.collection.each(this.addTodo, this);
        },

        addTodo: function (item) {
            new TodoItem({
                    model: item,
                    onTodoRemove: this.removeTodo.bind(this)
                })
                .addTo(this, item.cid);
        },

        removeTodo: function (cid) {
            this.collection.removeTodo(cid);
        },

        render: function () {
            var ret = SmartView.prototype.render.apply(this, arguments);
            this.$el.find('input.title').focus();
            return ret;
        }
    });

    return TodoList;
});