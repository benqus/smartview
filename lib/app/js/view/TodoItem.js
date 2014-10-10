define(function (require) {
    'use strict';

    var SmartView = require('SmartView');

    /**
     * @class    TodoItem
     * @extends {SmartView}
     */
    var TodoItem = SmartView.extend({
        tagName: 'li',
        className: 'TodoItem',
        events: {
            'change .toggle': 'onToggle',
            'click .remove': 'onRemove'
        },

        options: ['onTodoRemove'],

        template: [
            '<div class="{{#done}}done{{/done}}">',
                '<span class="title">{{ title }}</span>',
                '<input type="checkbox" class="toggle" {{#done}}checked{{/done}} />',
                '<input type="button" class="remove" value="-" />',
            '</div>'
        ],

        onToggle: function () {
            this.model.toggleDone();
            this.render();
        },

        onRemove: function () {
            this.onTodoRemove(this.model.cid);
        }
    });

    return TodoItem;
});