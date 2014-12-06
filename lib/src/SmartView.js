(function (factory) {
    // UMD
    var _$, __, _hbs, _Backbone;

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'underscore', 'backbone', 'handlebars'], factory);
    } else if (typeof exports === 'object') {
        _$ = require('jquery');
        __ = require('underscore');
        _hbs = require('handlebars');
        _Backbone = require('backbone');

        module.exports = factory(_$, __, _Backbone, _hbs);
    } else {
        Backbone.SmartView = factory($, _, Backbone, Handlebars);
    }
}(function ($, _, Backbone, hbs) {
    'use strict';

    var View = Backbone.View,
        // SmartView specific interface
        keys = (Object.keys || function (obj) {
            var k = [], i;
            for (i in obj) {
                if (obj.hasOwnProperty(i) && k.indexOf(i) === -1) {
                    k.push(i);
                }
            }
            return k;
        });

    /**
     * Detaches and renders the child view. Must be bound to a parent view on SmartView#addChild!
     * @param {string}  name
     * @param {object} [overrides]
     */
    var renderCallback = function (name, overrides) {
        var childView = this.getChild(name),
            selector = (this.mapping[name] || this.mapping['*']),
            root = selector ? this.el.querySelector(selector) : this.el,
            index;

        if (!this.mapping[name]) {
            index = _.indexOf(root.children, childView.el);
        }

        childView.detach();

        this.updateChild(childView, name, overrides, index);
    };

    /**
     * @class    SmartView
     * @extends {Backbone.View}
     */
    var SmartView = View.extend({
        // default View attributes (states), used for context attributes
        defaults: {},
        // map child's by their names to certain selector in the template
        mapping: {},
        // template as string, array or function
        template: '',
        // Array of events to listen for on the model/collection to re-render the View
        modelEvents: [],
        // Array of strings as options to preserve on the instance - sort of an interface
        callbacks: [],

        /**
         * @override
         */
        constructor: function (options) {
            this._childViews = {};
            this._renderCallback = undefined;
            // super
            View.apply(this, arguments);
            // properties
            this._ensureCallbacks(options || {});
            this._bindModelListeners();
        },

        // ensure that the options object contains the required callbacks
        _ensureCallbacks: function (options) {
            this.callbacks.forEach(function (item) {
                if (this[item] || !options[item]) { // throw error if the method is already implemented
                    throw new Error('Contract ' + item + ' has already been implemented!');
                }
                this[item] = options[item];
            }, this);
        },

        // binding model/collection events
        _bindModelListeners: function () {
            if (Array.isArray(this.modelEvents)) {
                this.modelEvents.forEach(this._startListening, this);
            } else if (typeof this.modelEvents === 'object') {
                keys(this.modelEvents).forEach(this._bindListener, this);
            }
        },

        // iterator to binding a listener if modelEvents is an object
        _bindListener: function (event) {
            var listener = this.modelEvents[event];
            this._startListening(event, this[listener]);
        },

        // Start listening to model events to re-render the View
        _startListening: function (event, callback) {
            var observed = (this.model || this.collection);
            this.listenTo(observed, event, (callback || this.render));
        },

        // set callback to be invoked from updating from the parent View
        _setRenderCallback: function (callback) {
            this._renderCallback = callback;
        },

        // resolves a string to a child SmartView
        _resolveChild: function (child) {
            if (typeof child === 'string') {
                return this.getChild(child);
            }
            return child;
        },

        // Is the instance rendered into the DOM?
        isAttached: function () {
            return (this.el.parentNode != null);
        },

        /**
         * Convenience method to chaining when creating a child View.
         * @param   {SmartView} parent - View to add to
         * @param   {string}    name
         * @returns {SmartView}
         */
        addTo: function (parent, name) {
            parent.addChild(name, this);
            return this;
        },

        /**
         * @param {string}    name
         * @param {SmartView} child
         */
        addChild: function (name, child) {
            // remove old child
            this.removeChild(this._childViews[name], name);
            // set new child
            this._childViews[name] = child;
            // setting the callback to invoke the render form the parent View
            child._setRenderCallback(renderCallback.bind(this, name));
            // render the child View too if the View is rendered
            this.renderChild(child);
        },

        /**
         * @param   {string}    name
         * @returns {SmartView}
         */
        getChild: function (name) {
            return this._childViews[name];
        },

        /**
         * @param {SmartView}  child
         * @param {string}     name
         * @param {object}    [overrides]
         * @param {object}    [index]     - internal option
         */
        updateChild: function (child, name, overrides, index) {
            var root     = this.el,
                mapping  = (this.mapping || {}),
                selector = (mapping[name] || mapping['*'] || null);

            if (selector) {
                root = root.querySelector(selector);
            }

            child.update(overrides);

            if (typeof index === 'number' && index >=0) {
                root.insertBefore(child.el, root.children[index])
            } else {
                root.appendChild(child.el);
            }
        },

        /**
         * @param {SmartView}  child
         * @param {object}    [overrides]
         */
        renderChild: function (child, overrides) {
            child = this._resolveChild(child);
            child.render(overrides);
        },

        /**
         * @param {SmartView} child
         */
        detachChild: function (child) {
            child = this._resolveChild(child);
            child.detach();
        },

        /**
         * @param {SmartView|string} child
         * @param {string}    name
         */
        removeChild: function (child, name) {
            child = this._resolveChild(child);
            if (child) {
                child.remove();
                delete this._childViews[name];
            }
        },

        /**
         * Removes all child Views.
         * @returns {SmartView}
         */
        removeChildren: function () {
            _.each(this._childViews, this.removeChild, this);
            return this;
        },

        /**
         * Returns the defaults from either the instance or its prototype
         * @returns {object}
         */
        getDefaults: function () {
            var defaults = keys(this.constructor.prototype.defaults);
            return $.extend({}, this.defaults, _.pick(this, defaults));
        },

        /**
         * Should be overriden to add more context properties
         * @param   {object} [overrides] context attributes for rendering the template
         * @returns {object}
         */
        getContext: function (overrides) {
            var defaults,
                context;
            // return collection data
            if (this.collection) {
                return this.collection.toJSON();
            }
            // getting default states
            defaults = this.getDefaults();
            context = $.extend({}, defaults);
            // merging model attributes
            if (this.model) {
                $.extend(context, this.model.attributes, overrides);
            }
            return $.extend(context, overrides);
        },

        /**
         * Method needs to be overriden with logic that adds child SmartViews
         */
        build: function () {},

        /**
         * Detaches the View's root element and all its children from the DOM
         * @returns {SmartView}
         */
        detach: function () {
            if (this.isAttached()) {
                this.$el.detach();
                _.each(this._childViews, this.detachChild, this);
            }
            return this;
        },

        /**
         * @override
         */
        remove: function () {
            // detaching to cause only one reflow when removing the child Views
            this.detach();
            this.removeChildren();

            this._childViews = null;
            this._renderCallback = null;

            return View.prototype.remove.apply(this, arguments);
        },

        /**
         * @param {string} method
         * @param {View}   child
         */
        executeMethod: function (method, child) {
            var args = Array.prototype.slice.call(arguments, 1);
            child[method].apply(child, args);
            _.each(this._childViews, this.executeMethod.bind(this, method));
        },

        /**
         * @param {object} overrides
         */
        update: function (overrides) {
            var template = this.template,
                children = this._childViews,
                attributes,
                markup;
            // notify children about detach from DOM
            _.each(children, this.executeMethod.bind(this, 'onDetach'));
            // empty the View
            this.removeChildren();
            // rendering template
            if (!_.isFunction(template)) {
                template = SmartView.compile(template);
            }
            attributes = this.getContext(overrides);
            markup = template(attributes);
            this.$el.html(markup);
            // Build the View structure
            this.build();
            // render the added children - if any
            _.each(children, this.updateChild, this);
            return this;
        },

        /**
         * @override
         * @param    {object} [overrides] context attributes for rendering the template
         */
        render: function (overrides) {
            if (_.isFunction(this._renderCallback)) {
                this._renderCallback(overrides);
            } else {
                this.update(overrides);
            }

            return View.prototype.render.apply(this, arguments);
        }
    }, {
        /**
         * Proxy to Handlebars#compile
         * @static
         * @param   {string|string[]|function} input
         * @param   {object}                   options
         * @param   {object}                   env
         * @returns {function}
         */
        compile: function (input, options, env) {
            input = (_.isFunction(input) ? input() : input);
            input = (Array.isArray(input) ? input.join('') : input);
            return hbs.compile(input, options, env);
        }
    });

    return SmartView;
}));