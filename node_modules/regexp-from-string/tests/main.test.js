/*globals describe, it*/
'use strict';

const RegExpFromString = require('../');
const assert = require('assert');

describe('RegExpFromString', function() {

	describe('Create', function() {

		it(`Must create a new RegExp from String`, function() {
			assert.equal(RegExpFromString(`/Rock/`).constructor, RegExp);
		});

		it(`Must create a new RegExp from String with Flags`, function() {
			assert.equal(RegExpFromString(`/Rock/ig`).constructor, RegExp);
		});

		it(`Must create a new RegExp from a native RegExp`, function() {
			assert.equal(RegExpFromString(/Rock/ig).constructor, RegExp);
		});

		it(`'pattern' and 'flags' must match, e.g., RegExpFromString('/Rock/i') === /Rock/i`, function() {
			assert.equal(RegExpFromString(`/Rock/i`).toString(), /Rock/i.toString());
			assert.equal(RegExpFromString(`/Rock/ig`).toString(), /Rock/ig.toString());
		});

	});

	describe('findAll', function() {
		const regExpsToFind = [/Rock/g, /and/, /roll/i, /(?:!)$/gimy];
		const stringWithManyRegExps = `${regExpsToFind[0]} ${regExpsToFind[1]},${regExpsToFind[2]};${regExpsToFind[3]}`;
		const stringWithManyRegExpsWithNonsenseDelimiters = `${regExpsToFind[0]}###${regExpsToFind[1]}****${regExpsToFind[2]}zzzzzzk$\i    ${regExpsToFind[3]} Hendrix`;

		it(`Must return an Array`, function() {
			const regExpsFound = RegExpFromString.findAll(stringWithManyRegExps);
			assert.equal(regExpsFound.constructor, Array);
		});

		describe(`from '${stringWithManyRegExps}'`, function() {

			RegExpFromString.findAll(stringWithManyRegExps).forEach((regExp, i) => {
				it(`Must find ${regExp}`, function() {
					assert.equal(regExp.toString(), regExpsToFind[i].toString());
				});
			});

		});

		describe(`from '${stringWithManyRegExpsWithNonsenseDelimiters}'`, function() {

			RegExpFromString.findAll(stringWithManyRegExpsWithNonsenseDelimiters).forEach((regExp, i) => {
				it(`Must find ${regExp}`, function() {
					assert.equal(regExp.toString(), regExpsToFind[i].toString());
				});
			});

		});

	});

	describe('matchAll', function() {
		const regExpsToFind = [/Rock/g, /and/, /roll/i, /(?:!)$/gimy];
		const stringWithManyRegExps = `${regExpsToFind[0]} ${regExpsToFind[1]},${regExpsToFind[2]};${regExpsToFind[3]}`;
		const stringWithManyRegExpsWithNonsenseDelimiters = `${regExpsToFind[0]}###${regExpsToFind[1]}****${regExpsToFind[2]}zzzzzzk$\i    ${regExpsToFind[3]} Hendrix`;

		it(`Must return an Array`, function() {
			const regExpsFound = RegExpFromString.matchAll(stringWithManyRegExps);
			assert.equal(regExpsFound.constructor, Array);
		});

		describe(`from '${stringWithManyRegExps}'`, function() {

			RegExpFromString.matchAll(stringWithManyRegExps).forEach((regExp, i) => {
				it(`Must find ${regExp}`, function() {
					assert.equal(regExp[0], regExpsToFind[i].toString());
				});
			});

		});

		describe(`from '${stringWithManyRegExpsWithNonsenseDelimiters}'`, function() {

			RegExpFromString.matchAll(stringWithManyRegExpsWithNonsenseDelimiters).forEach((regExp, i) => {
				it(`Must find ${regExp}`, function() {
					assert.equal(regExp[0], regExpsToFind[i].toString());
				});
			});

		});
	});
});