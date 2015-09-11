# touchy

Yet another `tap`, `tap:hold` and `swipe` events enabler. Based on
[xtap-event](https://github.com/royriojas/xtap-event)/[tap.js](https://github.com/alexgibson/tap.js/)

TODO: Add unit tests

## installation

```bash
npm i --save touchy
```

## usage

```javascript
// usually this is enough to generate the events
// this can be done in a module that can be required
// at the beginning of your app to generate the events
var touchy = require('touchy');
touchy.enableOn(document);
```

## Events

This library will generate the following events:

- `tap`
- `tap:hold`
- `swipe`
- `swipe:up`
- `swipe:down`
- `swipe:left`
- `swipe:right`

### tap

The `tap` event is generated when:

- a `touchstart`/`mousedown` event is followed by a `touchend`/`mouseup`
- the `end target` is the same as the `start target`
- the user hasn't move the finger between the starting event and the end
  event for more than `options.minTapDisplacementTolerance` (default: 10px)
- the time between `touchstart`/`mousedown` and `touchend`/`mouseup` is
  less than `opts.tapHoldMinThreshold` (default: 500ms)

**Example**

```javascript
// usually this is enough to generate the events
var touchy = require('touchy');
touchy.enableOn(document);

var ele = document.querySelector('#selector');
ele.on('tap', function (e) {
  console.log('tap!');
});
```

### tap:hold

The `tap:hold` event is generated when:

- a `touchstart`/`mousedown` event is followed by a `touchend`/`mouseup`
- the `end target` is the same as the `start target`
- the user hasn't move the finger between the starting event and the end
  event for more than `options.minTapDisplacementTolerance` (default: 10px)
- the user has not released the finger for more than `opts.tapHoldMinThreshold` (default: 500ms)

**Example**

```javascript
// usually this is enough to generate the events
var touchy = require('touchy');
touchy.enableOn(document);

var ele = document.querySelector('#selector');
ele.on('tap:hold', function (e) {
  console.log('tap:hold!');
});
```

### swipe, swipe:left, swipe:right, swipe:up and swipe:down

The `swipe` event is generated when

- a `touchstart`/`mousedown` event is followed by `touchmove`/`mousemove` and then by a `touchend`/`mouseup`
- the user has moved the finger between the starting event and the end
  event for more than `options.minTapDisplacementTolerance` (default: 10px)
- a `tap:hold` event has not being generated

**Example**

```javascript
// usually this is enough to generate the events
var touchy = require('touchy');
touchy.enableOn(document);

var ele = document.querySelector('#selector');
ele.on('swipe', function (e) {
  console.log('swipe', e.detail.direction); // direction: down, up, left, right
});
```

Custom events are also generated with the direction of the swipe: `swipe:left`, `swipe:right`, `swipe:up` and `swipe:down`

```javascript
// usually this is enough to generate the events
var touchy = require('touchy');
touchy.enableOn(document);

var ele = document.querySelector('#selector');
ele.on('swipe:left', function (e) {
  console.log('swipe:left');
});
```

