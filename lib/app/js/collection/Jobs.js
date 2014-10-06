define(function (require) {
    'use strict';

    var Collection = require('backbone').Collection,
        Job        = require('model/Job');

    /**
     * @class Jobs
     * @extends {Backbone.Collection}
     */
    var Jobs = Collection.extend({
        model: Job
    });

    return Jobs;
});