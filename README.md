SmartView
===

The missing simplistic View logic from backbone.View. =)

Adds template, convenience properties/methods and child hierarchy management without having to bother with the rendering.

> Dependencies: Backbone, Handlebars

Check the [example usage](https://github.com/benqus/smartview/tree/master/lib/app).

## API - static methods

### SmartView#compile

Use this method to compile a template.

### SmartView#augment

Use this method to implement SmartView API on you `Backbone.View` class/instance.

## API - prototype methods

### SmartView#build

Add the child SmartView instances here

    SmartView.extend({
        ...
        build: function () {
            new SmartView()
                .addTo(this, 'child1')
        }
        ...
    });

### SmartView#template

Either a string, an array of strings, or a function returning the previous types.

Handlebars will auto-cache already existing templates so don't worry about using strings as templates.

    SmartView.extend({
        ...
        template: '<ul></ul>',
        ...
    });

## API - prototype properties

### SmartView#template

Either a string, an array of strings, or a function returning the previous types.

    SmartView.extend({
        ...
        template: '<ul></ul>',
        ...
    });

### SmartView#mapping

A map (object) describing where to render the named children in the View's template.

Use `*` to render everything in one 

    SmartView.extend({
        ...
        template: '<div class="container"></div>',
        
        mapping: {
            'myChild': '.container'
        },
        
        initialize: function () {
            new SmartView()
                .addTo(this, 'myChild');
        },
        ...
    });

### SmartView#modelEvents

Array of event names to listen to in order to re-render the SmartView instance.

The callback will be the current SmartView#render method.

    SmartView.extend({
        ...
        modelEvents: ['reset'],
        ...
    });

## API - callback interface

### SmartView#beforeRender

Invoked right before re/rendering the View.

Preventing the `render` can be done by returning `false` from this method.

### SmartView#afterRender

Invoked right after re/rendering the View.

### SmartView#beforeDetach

Invoked right before detaching (tearing the View#el out of DOM) the View.

Preventing the `detach` can be done by returning `false` from this method.

### SmartView#afterDetach

Invoked right after detaching the View.

### SmartView#beforeUpdate

Invoked right before updating (View is detached but not yet attached) the View.

Preventing the `update` can be done by returning `false` from this method.

### SmartView#afterUpdate

Invoked right after updating the View.

### SmartView#beforeRemove

Invoked right before remove (View is NOT yet detached) the View.

Preventing the `remove` can be done by returning `false` from this method.

### SmartView#afterRemove

Invoked right after removing the View.