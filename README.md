lite-router
===========

[![npm version](https://badge.fury.io/js/lite-router.svg)](https://www.npmjs.com/package/lite-router)
[![Build Status](https://travis-ci.org/topheman/lite-router.svg?branch=master)](https://travis-ci.org/topheman/lite-router)

## Introduction

I needed some simple routing solution for my [rxjs-experiments](https://topheman.github.io/rxjs-experiments/#/router) project (not based on any framework or libraries that provides routers out of the box).
So, I made a micro router, based on [history@2.x.x](https://github.com/ReactTraining/history/tree/v2).

The next step was to publish it as an npm package (my main interest being the [build workflow](#contributers) to setup on an es6+ code base specific to npm packages with multiples files).

#### Features

* history support (back button)
* mutiple routes / customizable routes
* deferred mounting (only mount a route when a promise is resolved)
* params support (optional)

## Install

```shell
npm install lite-router
```

## Use

### Code example

```js
import router from 'lite-router';

/**
 * Simple handler on route "/home" and any routes (since using the wildcard "*")
 */
const mountHome = () => {
  // code to run on route match
  document.getElementById('home-content').style.display = 'block';
  const unMount = () => {
    // code to run on route leave (you wight wanna clean listeners or others)
    document.getElementById('home-content').style.display = 'none';
  };
  // always return the unMount method
  return unMount;
};

/**
 * Param matching on route "/router/posts/:category/:title/edit"
 * params will contain an object like {category: "foo", title: "bar"}
 *
 * Also using Regexp matching: /^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i
 */
const mountParams = ({ location, params, history }) => {
  document.getElementById('params-content').style.display = 'block';
  console.log(location, params, history);
  const unMount = () => {
    document.getElementById('params-content').style.display = 'none';
  };
  return unMount;
}

const routes = [
  { pattern: '/', handler: mountHome },
  { pattern: '/router/posts/:category/:title/edit', handler: mountParams },
  { pattern: /^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i, handler: routerHandler },
  { pattern: '/defered-mounting', handler: mountHome, resolve: new Promise(res => setTimeout(res, 1000)) } // will mount mountHome handler on /defered-mounting once the resolve promise is resolve
  { pattern: '*' handler: mountHome }
];

// init router and return the unlisten function to use eventually when you'll be done
const unlisten = router(routes);
```

### More examples

You'll find the [example](https://github.com/topheman/lite-router/tree/master/example) folder which contains basic examples.
A [DEMO is available here](https://topheman.github.io/lite-router).

More advanced examples can be found on [rxjs-experiments](https://topheman.github.io/rxjs-experiments/#/router):

* [routes](https://github.com/topheman/rxjs-experiments/blob/master/src/routes.js)
* [router init](https://github.com/topheman/rxjs-experiments/blob/master/src/bootstrap.js)

## Api

#### Import router

```js
import router from lite-router
```

#### Init routes

```js
router(routes)
```

The `routes` array contains objects with the following properties:

* `pattern`: can be:
    * a simple string - ex: `/foo/bar`
    * a string containing matching params (identified with a colon) - ex: `/posts/:category/:title/edit`
        * you will retrieve the matched params in the `params` parameter of the handler
    * a regexp - ex: `/^\/router\/user\/([^\/?#]+)\/([^\/?#]+)$/i`
* `handler`: the function that will mount your view, must return an `unmount` function (to cleanup eventually)
    * signature: `({ location, params, history }) => [Function] unmount`
* resolve: *(optional)* a `Promise`, that when resolved, will let the matched handler mount

## Contributers

#### Install

```shell
git clone https://github.com/topheman/lite-router.git
cd lite-router
yarn
```

Install, then eventually, `npm link` the library to use it in local.

In your own project where you want to locally test `lite-router`, just run `npm link lite-router`.

#### Build

* One shot
    * all formats: `npm run build`
    * commonjs (output in `lib` dir): `npm run build:commonjs`
    * ecmascript module (ouput in `es` dir): `npm run build:es`
    * umd (output as `dist/lite-router.js`) : `npm run build:umd`
    * umd - minified (output as `dist/lite-router.min.js`) : `npm run build:umd:min`
* Watch mode (only commonjs format): `npm run build:watch`

#### Test

* One shot: `npm test` (will also lint the source code)
* Only unit tests: `npm run jest`
* Watch mode: `npm run jest:watch`

The tests are in the `tests` folder, it is ran via [jest](https://facebook.github.io/jest/).

#### Publish

##### Publish npm package

```shell
npm publish
```

##### Publish gh-pages

The gh-pages tracking branch is binded in `build/dist` folder. If you haven't it yet:

```shell
mkdir build
cd build
mkdir dist
cd dist
git init
git remote add origin https://github.com/topheman/lite-router.git
git fetch origin gh-pages
git checkout gh-pages
```

If you already have a `build/dist` folder, to update the github pages:

```shell
npm run build:gh-pages
cd build/dist
git add .
git commit -m "Update gh-pages"
git push origin gh-pages
```

Copyright 2017 © Christophe Rosset

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software
> and associated documentation files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following conditions:
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
> The Software is provided "as is", without warranty of any kind, express or implied, including
> but not limited to the warranties of merchantability, fitness for a particular purpose and
> noninfringement. In no event shall the authors or copyright holders be liable for any claim,
> damages or other liability, whether in an action of contract, tort or otherwise, arising from,
> out of or in connection with the software or the use or other dealings in the Software.
