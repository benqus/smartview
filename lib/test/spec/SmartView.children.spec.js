describe('SmartView - children', function () {

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

    describe('mapping', function () {
        it('named child', function () {
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
