define(function (require) {
    'use strict';

    var SmartView = require('SmartView'),
        Item = require('view/Item');

    /**
     * @class    Nav
     * @extends {SmartView}
     */
    var Nav = SmartView.extend({

        tagName:   'nav',

        className: 'Nav',

        events: {
            'click button': 'resetCollection'
        },

        mapping:   {
            '*': 'ul'
        },

        template:  SmartView.compile([
            '<ul></ul>',
            '<div>',
                '<button>reset</button>',
            '</div>'
        ]),

        /**
         * @override
         */
        initialize: function () {
            this.listenTo(this.collection, 'reset', this.render);
        },

        resetCollection: function () {
            // hard-coded data
            this.collection.reset([
                { link: '/d', text: 'd' },
                { link: '/e', text: 'e' },
                { link: '/f', text: 'f' }
            ]);
        },

        onUpdate: function () {
            this.removeChildren(); // remove existing children if any
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