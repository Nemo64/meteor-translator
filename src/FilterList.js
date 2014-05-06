
/**
 * Filter a little callbacks executed before a language string is final.
 * Filters include: parameter, pluralisation, i18n
 *
 * @constructor
 * @param {string} name
 * @param {function(mixed):mixed} validator
 */
FilterList = function (name, validator) {
  var self = this;
  
  self.name = name;
  self._validator = validator;
  self._filters = [];
};

_.extend(FilterList.prototype, {
  /**
   * The message which will be thrown on validation error.
   * 
   * @param {mixed} info  What the validation function returned.
   */
  validationMessage: function (info) {
    return "Filter '" + this.name + "' did not return a valid result!";
  },

  /**
   * Executes the filter list on the specified data.
   *
   * @param {mixed} data      The data to filter
   * @param {Object=} options Additional options passed to the filters
   */
  filter: function (data, options) {
    var self = this;
    
    _.each(self._filters, function (filter) {
      data = filter.call(self, data, options);
    });
    
    if (_.isFunction(self._validator)) {
      var valid = self._validator(data);
      if (! valid) {
        throw new Error(self.validationMessage(valid));
      }
    }
    
    return data;
  },

  /**
   * Checks if a filter is a valid function.
   *
   * @param {mixed} callback
   */
  _validateFilter: function (callback) {
    if (! _.isFunction(callback)) {
      throw new Error("A filter must be a function, "
        + typeof callback + " given!");
    }
  },

  /**
   * Appends a new filter.
   *
   * @param {function(mixed, Object, this: FilterList):mixed}
   */
  append: function (callback) {
    this._validateFilter(callback);
    this._filters.push(callback);
  },

  /**
   * Prepend a new filter.
   *
   * @param {function(mixed, Object, this: FilterList):mixed}
   */
  prepend: function (callback) {
    this._validateFilter(callback);
    this._filters.unshift(callback);
  }
});
