(function () {
  'use strict';
  var _ = require('underscore');

  function calculateBMI(weight, height) {
    if (_.isUndefined(weight) || _.isUndefined(height)) {
      throw new Error('Please provide both weight and height');
    }

    return weight / (((height / 100) * height) / 100);
  }

  module.exports = {
    calculateBMI: calculateBMI
  };
})();
