describe('SmartView', function () {

    var SmartView = Backbone.SmartView,
        assert = chai.assert,
        domRoot = document.querySelector('#fixture');

    afterEach(function () {
        domRoot.innerHTML = '';
    });

    function viewFactory(Class, options) {
        return new Class(_.extend({}, options, {
            el: domRoot
        })).render();
    }

    it('options defines a contract between an instance and the factory', function () {
        var TestClass = Backbone.SmartView.extend({
            options: [ 'contract1', 'contract2']
        });

        assert.throws(function () {
            new TestClass();
        });
    });

    it('renders its template with a model', function () {
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

    it('renders its template with a collection - via Handlebars helper', function () {
        var data = [
                { id: 1 },
                { id: 2 }
            ],
            template = '{{#models}}<p>{{ id }}</p>{{/models}}',
            TestClass = Backbone.SmartView.extend({
                template: template
            });

        viewFactory(TestClass, {
            collection: new Backbone.Collection(data)
        });

        assert.equal(domRoot.innerHTML, '<p>1</p><p>2</p>');
    });

});