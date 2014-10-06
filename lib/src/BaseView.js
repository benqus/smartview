define(function (require) {
    'use strict';

    var $    = require('jquery'),
        _    = require('underscore'),
        hbs  = require('handlebars'),
        View = require('backbone').View;

    /**
     * @class    BaseView
     * @extends {Backbone.View}
     */
    var BaseView = View.extend({
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
        constructor: function () {
            this._children = {};

            View.apply(this, arguments);
        },

        /**
         * @returns {boolean}
         */
        isRendered: function () {
            return !!this.$el.parent().length;
        },

        /**
         * @param {string}   name
         * @param {BaseView} view
         */
        addChild: function (name, view) {
            if (this._children[name] != null) {
                this._children[name].remove();
            }

            this._children[name] = view;

            // if the View is rendered into the DOM already
            // render the child View too
            if (this.isRendered()) {
                this.renderChild(this._children[name], name);
            }
        },

        /**
         * @param {BaseView} child
         * @param {string} name
         */
        renderChild: function (child, name) {
            var root     = this.el,
                mapping  = (this.mapping || {}),
                selector = (mapping[name] || mapping['*'] || null);

            if (selector) {
                root = root.querySelector(selector);
            }

            child
                .detach()
                .render();

            root.appendChild(child.el);
        },

        /**
         * @param {BaseView} child
         */
        detachChild: function (child) {
            child.detach();
        },

        /**
         * @param {BaseView} child
         * @param {string} name
         */
        removeChild: function (child, name) {
            child.remove();
            delete this._children[name];
        },

        /**
         * Can be overriden
         * @param {object} [overrides] context attributes for rendering the template
         * @returns {object}
         */
        getTemplateContext: function (overrides) {
            var attributes;

            if (this.model) {
                attributes = this.model.attributes;
            } else if (this.collection) {
                attributes = this.collection.toJSON();
            } else {
                return overrides;
            }

            return $.extend({}, attributes, overrides);
        },

        /**
         * Detaches the View's root element and all its children from the DOM
         * @returns {BaseView}
         */
        detach: function () {
            this.$el.detach();

            _.each(this._children, this.detachChild, this);

            return this;
        },

        /**
         * @override
         */
        remove: function () {
            _.each(this._children, this.removeChild, this);

            return View.prototype.remove.apply(this, arguments);
        },

        /**
         * @override
         * @param    {object} [overrides] context attributes for rendering the template
         */
        render: function (overrides) {
            var attributes,
                markup = this.template;

            if (_.isFunction(this.template)) {
                attributes = this.getTemplateContext(overrides);
                markup = this.template(attributes);
            }

            this.$el.html(markup);

            _.each(this._children, this.renderChild, this);

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

    return BaseView;
});