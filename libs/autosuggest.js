/**
 * @module views/AutoSuggest
 */
var Backbone = require('backbone'),
	/**
	 * @class
	 * @extends external:Backbone.Marionette.View
	 */
	AutoSuggest = Backbone.Marionette.View.extend(
		/** @lends module:AutoSuggest.prototype */
		{
			ui     : {},
			events : {
				'keypress' : 'onKeyPress'
			},

			initialize : function() {
				this.bind();
			},

			/**
			 * Validates the search input string on keypress event.
			 *
			 * @returns void
			 */
			onKeyPress : function() {
				var search = this.$el.val();
				if (search.length !== 0) {
					this.trigger(AutoSuggest.SEARCH_CHANGED, {searchString : search});
				}
			},

			/**
			 * Insert the given results to the autosuggest lists. If its empty, hides it.
			 * @param {Object} ev
			 * @private
			 */
			_insertResults : function(ev) {
				this._getResultsContainer().empty();
				if (typeof ev === 'object' && typeof ev.data === 'object') {
					Backbone.$.each(ev.data, Backbone.$.proxy(function(index, item) {
						var li = Backbone.$('<li/>');
						li.text(item);
						this._getResultsContainer().append(li);
					}, this));
					this._getResultsContainer().show();
				}
				else {
					this._getResultsContainer().hide();
				}
			},

			/**
			 * Creates the autosuggest container and inserts after the input.
			 *
			 * @returns {jQuery}   results container
			 * @private
			 */
			_getResultsContainer : function() {
				if (!this._resultsContainer) {
					this._resultsContainer = Backbone.$('<ul/>');
					this._resultsContainer.hide();
					this.$el.after(this._resultsContainer);
				}
				return this._resultsContainer;
			},

			/**
			 * Binds the event listeners.
			 */
			bind : function() {
				this.on(AutoSuggest.SUGGESTION_UPDATE, Backbone.$.proxy(this._insertResults, this));
			}//,

			/**
			 * Unbinds the event listeners.
			 */
			/*unbind : function() {
				this.un(AutoSuggest.SUGGESTION_UPDATE, Backbone.$.proxy(this._insertResults, this));
			}*/
		}
	);

AutoSuggest.SUGGESTION_UPDATE = 'suggestion_update';
AutoSuggest.SEARCH_CHANGED = 'search_changed';

module.exports = AutoSuggest;
