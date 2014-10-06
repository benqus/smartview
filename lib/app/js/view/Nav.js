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

        mapping:   {
            '*': 'ul'
        },

        template:  SmartView.compile(
            '<ul></ul>'
        ),

        /**
         * @override
         */
        initialize: function () {
            this.collection.each(this.addItem, this);
        },

        addItem: function (item) {
            var view = new Item({
                model: item
            });

            this.addChild(item.cid, view);
        }
    });

    return Nav;
});