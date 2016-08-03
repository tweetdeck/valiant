# valiant

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![Build Status](https://travis-ci.org/tweetdeck/valiant.svg?branch=master)](https://travis-ci.org/tweetdeck/valiant)

JavaScript interval arithmetic library.

An interval represents a range of data with an associated sort function that defines how values relate to each other. For example, a range of numbers just uses subtraction.

Intervals can have inclusive or exclusive bounds, and you can define a custom sort function.

For more, see [Wikipedia](http://en.wikipedia.org/wiki/Interval_(mathematics)). This library is largely inspired by the Haskell's [Data.Interval](https://hackage.haskell.org/package/data-interval-0.4.0/docs/Data-Interval.html) and was built originally to manage lists of Tweets within [TweetDeck](https://tweetdeck.twitter.com).

## Install

```
npm install --save valiant
```

## Use

To make an Interval, you need to create a constructor:

```js
import { createInterval } from 'valiant';

const Interval = createInterval();
```

By default it will manage integers:

```js
// (0,100] — the numbers 0 to 100, excluding 0
new Interval(
    Interval.exclusiveEndpoint(0),
    Interval.inclusiveEndpoint(100)
)
```

You can provide a custom sort function to support a different data type:

```js
const DateInterval = createInterval(function sortDates(a, b) {
    return a.getTime() - b.getTime();
});

// [12 hours ago,now] — 12 hours ago until now
new DateInterval(
    DateInterval.incEnd(
        new Date(Date.now() - (1000 * 60 * 60 * 12))
    ),
    DateInterval.incEnd(
        new Date(Date.now())
    )
)
```

You can do calculations with two intervals:

```js
i = [1,3]
j = [2,4]
k = [5,6]

i.intersection(j)         // [2,3]
i.hull(j)                 // [1,4]
i.contiguousWith(j)       // true
i.unify(j)                // [1,4]

i.intersection(k)         // Interval.empty
i.hull(k)                 // [1,6]
i.contiguousWith(k)       // false
i.unify(k)                // Interval.empty

i.equalTo(j)              // false
i.contains(2)             // true
i.isSubsetOf(j)           // false
```

If there is no possible unification, the empty set (`Interval.empty`) results.

There are two special intervals:

```js
Interval.empty // {}
Interval.whole // (-Infinity, Infinity)
```

You can also create an interval of value:

```js
Interval.singleton(5) // [5,5]
```

To get Haskelly for a bit, because of the closed-over sort function, Interval is a bit like a typeclass with an Ordinal
type constraint:

```haskell
data Ord a => Interval a = Interval (EndPoint a, Bool) (Endpoint a, Bool)
```

## Why?

[TweetDeck](https://tweetdeck.twitter.com) uses this library to manage lists of many kinds of data (we call them chirps). With it we detect overlapping blocks of Tweets, gaps and do neat memory management optimisations.

## Development

```
$ npm install
$ npm test
```

Commit messages should follow the [Angular commit message guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).

### Release

This repository uses [semantic-release](https://github.com/semantic-release/semantic-release). Changes will automatically be released to npm.
