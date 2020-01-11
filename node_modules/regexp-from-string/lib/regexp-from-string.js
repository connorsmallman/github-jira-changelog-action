'use strict';

const RegExpFromString = (function RegExpFromString() {

	const patternManyRegExps = /\/([^\/]+)\/([gimuy]+)?/g;
	const patternRegExp = /^\/(.*)\/([gimuy]+)?$/;

	function findAll(input) {
		const regExpPatterns = input && input.match(patternManyRegExps);
		if (!regExpPatterns) {
			return regExpPatterns;
		}

		return regExpPatterns.map(rxPattern => createRegExpFromString(rxPattern));
	}

	function createRegExpFromString(input) {
		if (input.constructor === RegExp) {
			return input
		}
		const match = input && input.match(patternRegExp);
		if (!match) {
			return;
		}

		return new RegExp(match[1], match[2]);
	}

	function matchAll(input) {
		let regExps = [];
		let match;
		while (match = patternManyRegExps.exec(input)) {
			regExps.push(match);
		}

		return regExps;
	}

	function constructor(input) {
		return createRegExpFromString(input);
	}

	// NEW
	constructor.findAll = findAll;
	constructor.matchAll = matchAll;

	return constructor;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = RegExpFromString;
}