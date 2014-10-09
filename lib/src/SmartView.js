(function (root, factory) {
    // UMD
    var _$,
        __,
        _hbs,
        _Backbone;

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'underscore', 'backbone', 'handlebars'], factory);
    } else if (module && typeof module === 'object' && module.exports) {
        _$ = require('jquery');
        __ = require('underscore');
        _hbs = require('handlebars');
        _Backbone = require('Backbone');

        module.exports = factory(_$, __, _Backbone, _hbs);
    } else {
        root.SmartView = Backbone.SmartView = factory($, _, Backbone, Handlebars);
    }
}(function () {
    return this;
}(), function ($, _, Backbone, hbs) {
    'use strict';

    var View = Backbone.View,
        api = [
            'build', 'detach', 'update',
            'beforeUpdate', 'afterUpdate',
            'beforeRender', 'afterRender',
            'beforeRemove', 'afterRemove',
            'beforeDetach', 'afterDetach'
        ],
        noOp = function () {};

    /**
     * Detaches and renders the child view. Must be bound to a parent view on SmartView#addChild!
     * @param {string}  name
     * @param {object} [overrides]
     */
    var renderCallback = function (name, overrides) {
        var childView = this.getChild(name),
            selector = (this.mapping[name] || this.mapping['*']),
            root = this.el,
            index;

        if (selector) {
            root = root.querySelector(selector);
        }

        if (!this.mapping[name]) {
            index = _.indexOf(root.children, childView.el);
        }

        childView.detach();

        this.renderChild(childView, name, overrides, index);
    };

    /**
     * @class    SmartView
     * @extends {Backbone.View}
     */
    var SmartView = View.extend({
        // map child's by their names to certain selector in the template
        mapping: {},

        // template as string, array or function
        template: '',

        // Array of events to listen for on the model/collection to re-render the View
        modelEvents: [],

        /**
         * @override
         */
        constructor: function () {
            this._childViews = {};
            this._renderCallback = undefined;
            this._isRendered = false;

            View.apply(this, arguments);

            (this.modelEvents || []).forEach(this._startListening, this);
        },

        // Start listening to model events to re-render the View
        _startListening: function (event) {
            var observed = (this.model || this.collection);
            this.listenTo(observed, event, this.render);
        },

        // set callback to be invoked from updating from the parent View
        _setRenderCallback: function (callback) {
            this._renderCallback = callback;
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
         * @param {SmartView} view
         */
        addChild: function (name, view) {
            // remove old child
            this.removeChild(this._childViews[name], name);

            this._childViews[name] = view;

            // setting the callback to invoke the render form the parent View
            view._setRenderCallback(renderCallback.bind(this, name));

            // render the child View too if the View is rendered
            if (this._isRendered) {
                this.renderChild(view, name);
            }
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
        renderChild: function (child, name, overrides, index) {
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
         * @param {SmartView} child
         */
        detachChild: function (child) {
            child.detach();
        },

        /**
         * @param {SmartView} child
         * @param {string}    name
         */
        removeChild: function (child, name) {
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
         * Should be overriden to add more context properties
         * @param   {object} [overrides] context attributes for rendering the template
         * @returns {object}
         */
        getContext: function (overrides) {
            var attributes;

            if (this.model) {
                attributes = this.model.attributes;
            } else if (this.collection) {
                attributes = this.collection.toJSON();
            } else {
                return (overrides || {});
            }

            return $.extend({}, attributes, overrides);
        },

        /**
         * Detaches the View's root element and all its children from the DOM
         * @returns {SmartView}
         */
        detach: function () {
            var doDetach = this.beforeDetach();

            if (doDetach !== false) {
                this.$el.detach();

                this._isRendered = false;

                _.each(this._childViews, this.detachChild, this);

                this.afterDetach();
            }

            return this;
        },

        /**
         * @override
         */
        remove: function () {
            var doRemove = this.beforeRemove(),
                ret;

            if (doRemove !== false) {
                // detaching to cause only one reflow when removing the child Views
                this.detach();
                this.removeChildren();

                this._isRendered = false;
                this._childViews = null;
                this._renderCallback = null;

                ret = View.prototype.remove.apply(this, arguments);

                this.afterRemove();
            }

            return (ret || this);
        },

        /**
         * @param {object} overrides
         */
        update: function (overrides) {
            var doUpdate = this.beforeUpdate(overrides),
                template = this.template,
                attributes,
                markup;

            if (doUpdate !== false) {
                this._isRendered = false;
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
                _.each(this._childViews, this.renderChild, this);

                this.afterUpdate(overrides);
            }

            return this;
        },

        /**
         * @override
         * @param    {object} [overrides] context attributes for rendering the template
         */
        render: function (overrides) {
            var doRender = this.beforeRender(),
                ret;

            if (doRender !== false) {
                if (_.isFunction(this._renderCallback)) {
                    this._renderCallback(overrides);
                } else {
                    this.update(overrides);
                }

                this._isRendered = true;

                ret = View.prototype.render.apply(this, arguments);

                this.afterRender();
            }

            return (ret || this);
        }
    }, {
        /**
         * Proxy to Handlebars#compile
         * @param   {string|string[]} input
         * @param   {object}          options
         * @param   {object}          env
         * @returns {function}
         */
        compile: function (input, options, env) {
            input = (_.isFunction(input) ? input() : input);
            input = (Array.isArray(input) ? input.join('') : input);
            return hbs.compile(input, options, env);
        },

        /**
         * Augment SmartView callback API for a View descendant (instance/prototype)
         * @param  {Backbone.View} implementor
         * @return {Backbone.View}
         */
        augment: function (implementor) {
            if (implementor instanceof View) {
                api.forEach(function (callbackName) {
                    if (this[callbackName] == null) {
                        this[callbackName] = noOp;
                    }
                }, implementor);
            }
            return implementor;
        }
    });

    SmartView.augment(SmartView.prototype);

    return SmartView;
}));