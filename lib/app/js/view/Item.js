define(function (require) {
    'use strict';

    var BaseView = require('baseview');

    /**
     * @class    Item
     * @extends {BaseView}
     */
    var Item = BaseView.extend({

        tagName: 'li',

        className: 'Item',

        template: BaseView.compile(
            '<a href="{{ link }}">{{ text }}</a>'
        )
    });

    return Item;
});