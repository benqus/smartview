define(function (require) {
    'use strict';

    var $    = require('jquery'),
        _    = require('underscore'),
        hbs  = require('handlebars'),
        View = require('backbone').View;

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
     * @param {Element}       el
     * @param {jQuery|string} $el
     * @returns {boolean}
     */
    var isElInDOM = function (el, $el) {
        if (el instanceof Element) {
            return true;
        }

        if ($el) {
            return !!($el instanceof $ ? $el[0] : (document.querySelector($el)).length);
        }

        return false;
    };

    /**
     * @class    SmartView
     * @extends {Backbone.View}
     */
    var SmartView = View.extend({
        /**
         * @type {object}
         */
        mapping: {},

        /**
         * @type {string|function}
         */
        template: '',

        /**
         * @override
         */
        constructor: function (options) {
            options = (options || {});

            this._childViews = {};
            this._renderCallback = undefined;
            this._isContainedInDOM = isElInDOM(options.el, options.$el);

            View.apply(this, arguments);

            // render the template into this View after it has been created
            this.renderTemplate();
        },

        /**
         * @private
         * @param   {function} callback
         */
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

            // this is private to this module so can be called
            view._setRenderCallback(renderCallback.bind(this, name));

            // render the child View too if the View is rendered
            if (this._isContainedInDOM) {
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
         * @param {object}    [index]
         */
        renderChild: function (child, name, overrides, index) {
            var root     = this.el,
                mapping  = (this.mapping || {}),
                selector = (mapping[name] || mapping['*'] || null);

            if (selector) {
                root = root.querySelector(selector);
            }

            child.render(overrides);

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
            this.$el.detach();

            this._isContainedInDOM = false;

            _.each(this._childViews, this.detachChild, this);

            return this;
        },

        /**
         * @override
         */
        remove: function () {
            this.detach();

            _.each(this._childViews, this.removeChild, this);

            this._childViews = null;
            this._renderCallback = null;
            this._isContainedInDOM = false;

            return View.prototype.remove.apply(this, arguments);
        },

        /**
         * @param {object} overrides
         */
        renderTemplate: function (overrides) {
            var attributes,
                markup;

            if (_.isFunction(this.template)) {
                attributes = this.getContext(overrides);
                markup = this.template(attributes);
            } else {
                markup = this.template;
            }

            this.$el.html(markup);
        },

        /**
         * @override
         * @param    {object} [overrides] context attributes for rendering the template
         */
        render: function (overrides) {
            // if the View is already rendered and is not a top-level View then
            // 1: detach the current view and
            // 2: invoke the callback from the parent to
            //    render this child in the parent's template
            if (this._isContainedInDOM && _.isFunction(this._renderCallback)) {
                this._renderCallback(overrides);
            } else {
                this.renderTemplate(overrides);
                _.each(this._childViews, this.renderChild, this);
                this._isContainedInDOM = true;
            }

            return View.prototype.render.apply(this, arguments);
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
            if (Array.isArray(input)) {
                input = input.join('');
            }
            return hbs.compile(input, options, env);
        }
    });

    return SmartView;
});