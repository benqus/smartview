define(function (require) {
    'use strict';

    var SmartView = require('SmartView'),
        Item = require('view/Item');

    /**
     * @class    Nav
     * @extends {SmartView}
     */
    var Nav = SmartView.extend({

        tagName: 'nav',

        className: 'Nav',

        events: {
            'click button': 'resetCollection'
        },

        mapping: {
            '*': 'ul'
        },

        template: [
            '<ul></ul>',
            '<div>',
                '<button>reset</button>',
            '</div>'
        ],

        modelEvents: ['reset'],

        resetCollection: function () {
            this.collection.reset([
                { link: '/d', text: 'd' },
                { link: '/e', text: 'e' },
                { link: '/f', text: 'f' }
            ]);
        },

        build: function () {
            this.collection.each(this.addItem, this);
        },

        addItem: function (item) {
            new Item({
                    model: item
                })
                .addTo(this, item.cid);
        }
    });

    return Nav;
});