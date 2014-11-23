var assert = require('chai').assert,
	sinon = require('sinon'),

	AutoSuggest = require('../libs/autosuggest'),

	testContent = require('./content/testcontent.html'),
	testUtils = require('./setup_utils');

suite('chatView', function() {
	var testSuite = {
		'a' : [
			'aleska',
			'anna',
			'anal_love'
		],
		'f' : [
			'fruit_love',
			'funfair',
			'fart_king'
		]
	};
	setup(function() {
		testUtils.loadTestContent(testContent);

		this.sinonSandbox = sinon.sandbox.create();
		this.sinonSandbox.spy(AutoSuggest.prototype, 'onKeyPress');

		this.autoSuggest = new AutoSuggest({
			el : '#search-input'
		});
	});

	teardown(function() {
		this.sinonSandbox.restore();
	});

	test('keypress event test', function() {
		var testString = 'a';
		this.autoSuggest.$el.val(testString).trigger('keypress');
		assert.isTrue(this.autoSuggest.onKeyPress.calledOnce, 'keypress event listener not triggered');
	});

	test('empty input test', function() {
		var testString = '';
		this.autoSuggest.$el.val(testString).trigger('keypress');
		assert.isTrue(this.autoSuggest.onKeyPress.calledOnce, 'keypress event listener not triggered');
	});

	test('search change trigger test', function() {
		var testString = 'a',
			handlerSpy = sinon.spy();
		this.autoSuggest.on(AutoSuggest.SEARCH_CHANGED, handlerSpy);

		this.autoSuggest.$el.val(testString).trigger('keypress');

		assert.isTrue(handlerSpy.calledOnce, 'search change event not triggered');
		assert.isTrue(handlerSpy.calledWith({searchString : testString}), 'search string not returned properly');
	});

	test('result insertion test', function() {
		var testString = 'a';

		this.autoSuggest.trigger(AutoSuggest.SUGGESTION_UPDATE, {result : true, data : testSuite[testString]});
		assert.isTrue(typeof this.autoSuggest._getResultsContainer() !== 'undefined', 'results container not created');
		assert.lengthOf(this.autoSuggest._getResultsContainer().find('li'), testSuite[testString].length,
			'results not inserted');
	});

	test('no result test', function() {
		var testString = 'b';

		this.autoSuggest.trigger(AutoSuggest.SUGGESTION_UPDATE, {result : true, data : testSuite[testString]});
		assert.lengthOf(this.autoSuggest._getResultsContainer().find('li'), 0, 'results in the list');
	});
});