define(function (require) {
    'use strict';

    var SmartView = require('SmartView');

    /**
     * @class    Item
     * @extends {SmartView}
     */
    var Item = SmartView.extend({

        tagName: 'li',

        className: 'Item',

        template: [
            '<a href="{{ link }}" class="{{ color }}">',
                '{{ text }}',
                '<button>@</button>',
            '</a>'
        ],

        events: {
            'click button': 'onClick'
        },

        constructor: function () {
            SmartView.apply(this, arguments);
            this.selected = false;
        },

        toggleSelected: function () {
            this.selected = !this.selected;
            return this;
        },

        onClick: function () {
            this.toggleSelected()
                .render({
                    color: this.selected ? 'red' : ''
                });
            return false;
        }
    });

    return Item;
});