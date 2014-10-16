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
                '<input type="checkbox" class="done" />',
                '<input type="text" class="title" autofocus />',
                '<input type="submit" value="+" />',
            '</form>'
        ],

        modelEvents: {
            'add': 'addTodo',
            'remove': 'removeTodo'
        },

        onSubmit: function (event) {
            event.preventDefault();

            var input = this.el.querySelector('.create > .title'),
                title = input.value,
                done;

            if (title !== '') {
                this.collection.create({
                    title: title,
                    done: this.$el.find('.done').is(':checked')
                });

                input.value = '';
            }
        },

        build: function () {
            this.collection.each(this.addTodo, this);
        },

        removeTodoModel: function (cid) {
            this.collection.removeTodo(cid);
        },

        addTodo: function (todoModel) {
            new TodoItem({
                    model: todoModel,
                    onTodoRemove: this.removeTodoModel.bind(this)
                })
                .addTo(this, todoModel.cid);
        },

        removeTodo: function (model) {
            this.removeChild(model.cid);
        },

        render: function () {
            var ret = SmartView.prototype.render.apply(this, arguments);
            this.$el.find('input.title').focus();
            return ret;
        }
    });

    return TodoList;
});