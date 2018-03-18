# location-lite
Master: [![Build Status](https://travis-ci.org/tjmonsi/location-lite.svg?branch=master)](https://travis-ci.org/tjmonsi/location-lite)
Develop: [![Build Status](https://travis-ci.org/tjmonsi/location-lite.svg?branch=develop)](https://travis-ci.org/tjmonsi/location-lite)

`<location-lite>` Location path getter system for making a single-page-application.
It intercepts the global clicking of any `<a>` tag and pushes the anchor's `href` url to `history`
without loading the page from the server. It only intercepts clicks with the intent to
open in the same window, so middle mouse clicks and ctrl/cmd clicks work fine.

You can customize this behavior with the `urlSpaceRegex`.

This is a copied version of without using Polymer `https://github.com/PolymerElements/iron-location/blob/__auto_generated_3.0_preview/iron-location.js`


## Properties

When the URL is `/search?query=583#details`, the location-lite's properties will be:

- path: `/search`
- query: `query=583`
- hash: `details`

It would also fire `path-change`, `query-change`, and `hash-change` events.

Settable properties would be the following:

- dwellTime: Copied from iron-location, it protects against accidental history spamming by only adding entries to the user's history if the URL stays unchanged for `dwellTime` milliseconds
- urlSpaceRegex: allows you to disregard interception of urls that follow the `urlSpaceRegex` pattern


## How to install:

### Using npm
This is the recommended way. To install, just do this:
```
npm i --save @littleq/location-lite
```

## Out of the box, what can I do?

### On evergreen browsers that support ES6 and import (Latest Firefox and Chrome)

You can either load it via html script

```html
<script type="module" src="node_modules/@littleq/location-lite/location-lite.js">
```

or load it in your JS file

```js
import 'node_modules/@littleq/location-lite/location-lite.js'
```

and then just use the tag on your html document

```html
<location-lite></location-lite>
```

### Usage on bundlers like Webpack

Same as above.

### For non-Chrome evergreen browsers (Latest Firefox, Safari, and Edge)

You need to add this additional script for polyfill

```
npm i --save @webcomponents/webcomponentsjs
```

```html
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js">
```

And then wrap around the files after the `WebComponentsReady` event has been fired

```html
<script>
  window.addEventListener('WebComponentsReady', function() {
    var component = document.createElement('script');
    component.src = 'node_modules/@littleq/location-lite/location-lite.js';
    component.type = 'module';
    document.head.appendChild(component);
  });
</script>
```


### If you compiled and bundled the element to ES5

if you are using Webpack and you have bundled it in ES5 for older browsers, you also need:

```html
<script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js">
```


### If you don't need a bundler but is capable for use in older browsers

If you want to use the ES5 version, add this

```html
<script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js">
```

Before adding this.

```html
<script>
  window.addEventListener('WebComponentsReady', function() {
    var component = document.createElement('script');
    component.src = 'node_modules/@littleq/location-lite/dist/location-lite.umd.es5.js';
    document.head.appendChild(component);
  });
</script>
```

## What else can it do?

You can capture changes on `path`, `query`, and `hash` when you listen on `path-change`, `query-change`, and `hash-change` respectively.

```js
const el = document.querySelector('location-lite');
el.addEventListener('path-change', ({ detail: path }) => {
  console.log(path);
});

el.addEventListener('query-change', ({ detail: query }) => {
  console.log(query);
});

el.addEventListener('hash-change', ({ detail: hash }) => {
  console.log(hash);
});
```

## What files to import and how?

If you are going to use it on Evergreen Browsers that allows `<script type="module">`,
then you can just do this on your `js` files

```js
import './node_modules/@littleq/location-lite/location-lite.js';
```

or

```html
<script type="module" src="node_modules/@littleq/location-lite/location-lite.js">
```

If you are going to use it on Webpack or Rollup, you can do any of these

```js
// provided that node_modules is resolved in your configurations
import '.@littleq/location-lite';
```

or

```js
import './node_modules/@littleq/location-lite';
```

or

```js
import './node_modules/@littleq/location-lite/dist/location-lite.esm.js';
```

If you are going to use `require` and not `import` you can do any of these

```js
// provided that node_modules is resolved in your configurations
require('@littleq/location-lite');
```

or

```js
// provided that node_modules is resolved in your configurations
require('@littleq/location-lite/dist/location-lite.cjs.js').ElementLite;
```

If you are going to load it via the `<script>` tag, you need to do these

For ES6

```html
<script src="/node_modules/@littleq/location-lite/dist/location-lite.umd.js">
<!-- <script src="/node_modules/@littleq/location-lite/dist/location-lite.umd.min.js">
if you need the minified file -->
```

For ES5

```html
<script src="/node_modules/@littleq/location-lite/dist/location-lite.umd.es5.js">
<!-- <script src="/node_modules/@littleq/location-lite/dist/location-lite.umd.es5.min.js">
if you need the minified file -->
```


## And does it work on?

It works on all major evergreen Browsers (Edge, Safari, Chrome, Firefox) as long as you have the Polyfills
set (make sure to add `webcomponents-lite` or `webcomponents-loader` and load `location-lite` after the
`WebComponentsReady` event has been fired)

It also works on IE 11, Safari 11, Safari 10.1, Safari 9, and Safari 8.

Still checking on IE 10, 9, 8 and Safari 7, 6. (Need polyfills for `Map` and `WeakMap` when using the webcomponents-lite polyfill and custom-element-es5-adapter).


## Size

Based on size-limit

```
npm run size

> @littleq/location-lite@0.1.0 size /home/tjmonsi/Projects/@littleq/location-lite
> size-limit


  Package size: 1.37 KB
  Size limit:   1.5 KB
  With all dependencies, minified and gzipped
```

## Known Issues

1. Not yet tested for Production: https://github.com/tjmonsi/location-lite/issues/1
2. Not yet tested using Webpack on older browsers https://github.com/tjmonsi/location-lite/issues/2