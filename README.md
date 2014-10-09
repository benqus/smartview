SmartView
===

The missing simplistic View logic from backbone.View. =)

> Dependencies: Backbone, Handlebars

## Usage

```
var ItemView = SimpleView.extend({
    tagName: 'li',
    className: 'Item',
    
    modelEvents: ['change'],

    template: [
        '<a href="{{ link }}" class="{{ color }}">',
            '{{ text }}',
            '<button>@</button>',
        '</a>'
    ],

    events: {
        'click button': 'onClick'
    },

    constructor: function () {
        SmartView.apply(this, arguments);
        this.selected = false;
    },

    toggleSelected: function () {
        this.selected = !this.selected;
        return this;
    },

    onClick: function () {
        this.toggleSelected()
            .render({
                color: this.selected ? 'red' : ''
            });
        return false;
    }
});

var ListView = SmartView.extend({
    tagName: 'ul',
    className: 'ListView',
    
    modelEvents: ['reset'],
    
    template: [
        '<nav>',
            '<ul></ul>',
        '</nav>'
    ],
    
    mapping: {
        '*': 'ul'
    },
    
    build: function () {
        this.collection.each(function (item) {
            var view = new ItemView({
                model: item
            });
            view.addTo(this, item.cid);
        }, this);
    }
});


var App = SmartView.extend({
    template: [
        '<header>',
            '<h1>App</h1>',
        '</header>',
    ],
    
    build: function () {
        var collection = new Backbone.Collection([
            { link: '/a', text: 'a' },
            { link: '/b', text: 'b' },
            { link: '/c', text: 'c' }
        ]);
        
        new ListView({
                collection: collection
            })
            .addTo(this, 'listView');
    }
});

// creating new app
new App({
        el: document.body
    })
    .render();
```

