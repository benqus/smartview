describe('SmartView', function () {

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

    it('"options" defines a contract between an instance and the factory', function () {
        var TestClass = Backbone.SmartView.extend({
            options: [ 'contract1', 'contract2']
        });

        assert.throws(function () {
            new TestClass();
        });
    });

    it('"modelEvents" subscribes to model', function () {
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

        assert.equal(domRoot.innerHTML, 'a');

        model.set('name', 'b');

        assert.equal(domRoot.innerHTML, 'b');
    });

    describe('renders children', function () {
        it('into it own SmartView#el', function () {
            var TestClass = SmartView.extend({
                build: function () {
                    new SmartView()
                        .addTo(this, 'myChild1');

                    new SmartView()
                        .addTo(this, 'myChild2');

                    new SmartView()
                        .addTo(this, 'myChild3');
                }
            });

            viewFactory(TestClass);

            // domRoot is the SmartView#el
            assert.equal(
                domRoot.innerHTML,
                '<div></div>' +
                '<div></div>' +
                '<div></div>'
            );
        });
    });

    describe('renders template', function () {

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

    describe('renders template and named children', function () {

        it('named child mapping', function () {
            var ChildClass = SmartView.extend({
                    tagName: 'li',
                    className: 'ChildClass'
                }),
                TestClass = SmartView.extend({
                    template: [
                        '<nav>',
                        '<ul></ul>',
                        '</nav>'
                    ],
                    mapping: {
                        myChild1: 'nav > ul'
                    },
                    build: function () {
                        new ChildClass()
                            .addTo(this, 'myChild1');
                    }
                });

            viewFactory(TestClass);

            assert.equal(
                domRoot.innerHTML,
                '<nav>' +
                    '<ul>' +
                        '<li class="ChildClass"></li>' +
                    '</ul>' +
                '</nav>'
            );
        });

        it('wildcard mapping', function () {
            var ChildClass = SmartView.extend({
                    tagName: 'li',
                    className: 'ChildClass'
                }),
                TestClass = SmartView.extend({
                    template: [
                        '<nav>',
                        '<ul></ul>',
                        '</nav>'
                    ],
                    mapping: {
                        '*': 'nav > ul'
                    },
                    build: function () {
                        new ChildClass()
                            .addTo(this, 'myChild1');

                        new ChildClass()
                            .addTo(this, 'myChild2');

                        new ChildClass()
                            .addTo(this, 'myChild3');
                    }
                });

            viewFactory(TestClass);

            assert.equal(
                domRoot.innerHTML,
                '<nav>' +
                    '<ul>' +
                        '<li class="ChildClass"></li>' +
                        '<li class="ChildClass"></li>' +
                        '<li class="ChildClass"></li>' +
                    '</ul>' +
                '</nav>'
            );
        });
    });

});