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
            'click .remove': 'onRemove',
            'click .save': 'onSave',
            'click .edit': 'onEdit'
        },

        callbacks: ['onTodoRemove'],

        modelEvents: ['change'],

        template: [
            '<div class="{{#done}}done{{/done}}">',
                '<input type="checkbox" class="toggle" {{#done}}checked{{/done}} />',
                '{{#if editMode}}',
                    '<input class="title" value="{{ title }}" />',
                    '<button class="save">save</button>',
                '{{else}}',
                    '<span class="title">{{ title }}</span>',
                    '<button class="edit">edit</button>',
                '{{/if}}',
                '<button class="remove">delete</button>',
            '</div>'
        ],

        defaults: {
            editMode: false
        },

        onEdit: function () {
            this.render({
                editMode: true
            });
        },

        onSave: function () {
            var title = this.el.querySelector('.title').value;
            if (title) {
                this.model.setTitle(title);
                this.render();
            }
        },

        onToggle: function () {
            this.model.toggleDone();
        },

        onRemove: function () {
            this.onTodoRemove(this.model.cid);
        }
    });

    return TodoItem;
});