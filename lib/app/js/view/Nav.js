define(function (require) {
    'use strict';

    var BaseView = require('baseview'),
        Item = require('view/Item');

    /**
     * @class    Nav
     * @extends {BaseView}
     */
    var Nav = BaseView.extend({

        tagName:   'nav',

        className: 'Nav',

        mapping:   {
            '*': 'ul'
        },

        template:  BaseView.compile(
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