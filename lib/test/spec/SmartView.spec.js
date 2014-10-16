describe('SmartView - prototype options', function () {

    var SmartView = Backbone.SmartView,
        assert = chai.assert,
        domRoot = document.querySelector('#fixture');

    afterEach(function () {
        domRoot.innerHTML = '';
    });

    function viewFactory(Class, options) {
        return new Class(_.extend({}, {
            el: domRoot
        }, options)).render();
    }

    describe('defaults', function () {
        it('with View prototype defaults', function () {
            var defaults = { a: 'and' },
                TestClass = Backbone.SmartView.extend({
                    defaults: defaults,
                    template: function (context) {
                        assert.deepEqual(context, defaults);
                    }
                });

            viewFactory(TestClass);
        });

        it('with View instance defaults overriding prototype defaults', function () {
            var a = '$',
                defaults = { a: 'and' },
                TestClass = Backbone.SmartView.extend({
                    constructor: function () {
                        this.a = a; // this.a seals the prototype defaults
                        SmartView.apply(this, arguments);
                    },
                    defaults: defaults,
                    template: function (context) {
                        assert.deepEqual(context, {
                            a: a
                        });
                    }
                });

            viewFactory(TestClass);
        });
    });

    describe('template', function () {
        it('with a model', function () {
            var data = { a: 1, b: 2 },
                template = 'hakuna {{ a }} matata {{ b }}',
                TestClass = Backbone.SmartView.extend({
                    template: template
                });

            viewFactory(TestClass, {
                model: new Backbone.Model(data)
            });

            assert.equal(
                domRoot.innerHTML,
                template
                    .replace('{{ a }}', data.a)
                    .replace('{{ b }}', data.b)
            );
        });

        it('with a collection - via Handlebars helper', function () {
            var data = [
                    { id: 1 },
                    { id: 2 }
                ],
                template = '{{#models}}<p>{{ id }}</p>{{/models}}',
                TestClass = SmartView.extend({
                    template: template
                });

            viewFactory(TestClass, {
                collection: new Backbone.Collection(data)
            });

            assert.equal(domRoot.innerHTML, '<p>1</p><p>2</p>');
        });

    });

    describe('callbacks', function () {
        it('throws an error if a callback is not defined', function () {
            var TestClass = Backbone.SmartView.extend({
                callbacks: ['onCallback']
            });

            assert.throws(function () {
                new TestClass();
            });
        });

        it('methods are available on/merged to the instance', function () {
            var onCallback = function () {},
                TestClass = Backbone.SmartView.extend({
                    callbacks: ['onCallback']
                }),
                view = viewFactory(TestClass, {
                    onCallback: onCallback
                });

            assert.equal(view.onCallback, onCallback);
        });

    });

    describe('modelEvents', function () {
        it('subscribes & render', function () {
            var model = new Backbone.Model({
                    name: 'a'
                }),
                TestClass = SmartView.extend({
                    template: '{{ name }}',
                    modelEvents: ['change']
                });

            viewFactory(TestClass, {
                model: model
            });

            assert.equal(Object.keys(model._events).length, 1);
            assert.equal(domRoot.innerHTML, 'a');

            model.set('name', 'b');

            assert.equal(domRoot.innerHTML, 'b');
        });

        it('subscribe with custom callback', function () {
            var model = new Backbone.Model({
                    name: 'a'
                }),
                callbackHasBeenInvoked = [],
                TestClass = SmartView.extend({
                    template: '{{ name }}',
                    modelEvents: {
                        'change': 'onChange',
                        'change:name': 'onChange'
                    },
                    onChange: function () {
                        callbackHasBeenInvoked.push(true);
                    }
                });

            viewFactory(TestClass, {
                model: model
            });

            model.set('name', 'b');

            assert.equal(callbackHasBeenInvoked.length, 2);
        });
    });
});