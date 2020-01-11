# RegExpFromString

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/regexp-from-string.svg)](https://travis-ci.org/DiegoZoracKy/regexp-from-string)

Creates RegExp from a string, e.g. `'/string/gi'` and provides some utils to work with RegExp as strings, for example, to extract multi RegExps defined within a same string, e.g. `'/Rock/, /and/, /roll/i'`.

Out of the box support for `Node.js` and `Browsers`

## Installation

```javascript
npm install regexp-from-string
```
To use it on a Browser, without a build system, just include the file `lib/regexp-from-string.js`

## Usage

**Creating a RegExp**

`RegExpFromString()`;

```javascript
const RegExpFromString = require('regexp-from-string');

const regExp = RegExpFromString(`/Rock/ig`);
// `regExp` is the same as RegExp(/Rock/ig);
```

**Finding many RegExps at a String**

`RegExpFromString.findAll()`;

```javascript
const RegExpFromString = require('regexp-from-string');

const regExps = RegExpFromString.findAll(`/Rock/ /and|n/i /Roll$/g`);
// `regExps` will be the array [/Rock/, /and|n/i, /Roll$/g]
// Each value is a RegExp Object

// See how a specific delimiter is not needed
// So you can use anything that fits better for your case
// Any of the following will produces the same result as the example above
RegExpFromString.findAll(`/Rock/,/and|n/i,/Roll$/g`);
RegExpFromString.findAll(`/Rock/;/and|n/i;/Roll$/g`);
RegExpFromString.findAll(`/Rock/#$!$%/and|n/i  #&*E*& O#)/Roll$/g`);
```

**Get all the matches for the many RegExps found at a String**

`RegExpFromString.matchAll()`;

```javascript
// It behaves like findAll, but in this case
// it will return an Array with all the RegExp `match` instead of the RegExp itself
const RegExpFromString = require('regexp-from-string');

const regExps = RegExpFromString.matchAll(`/Rock/ /and|n/i /Roll$/g`);
// regExps will be:
[
	['/Rock/i',
		'Rock',
		'i',
		index: 0,
		input: '/Rock/i,/and|n/i,/Roll$/g'
	],
	['/and|n/i',
		'and|n',
		'i',
		index: 8,
		input: '/Rock/i,/and|n/i,/Roll$/g'
	],
	['/Roll$/g',
		'Roll$',
		'g',
		index: 17,
		input: '/Rock/i,/and|n/i,/Roll$/g'
	]
]
```
