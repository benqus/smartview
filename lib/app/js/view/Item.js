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

        template: SmartView.compile([
            '<a href="{{ link }}">',
                '{{ text }}',
                '<button>@</button>',
            '</a>'
        ]),

        events: {
            'click button': 'onClick'
        },

        onClick: function () {
            this.render();
            return false;
        },

        onRemove: function () {
            console.log(this.className);
        }

    });

    return Item;
});