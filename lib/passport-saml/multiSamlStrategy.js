'use strict';
var util = require('util');
var saml = require('./saml');
var SamlStrategy = require('./strategy');

function MultiSamlStrategy (options, verify) {
  if (!options || typeof options.fetchSamlOptions != 'function') {
    throw new Error('Please provide a finder method');
  }

  SamlStrategy.call(this, options, verify);
  this._fetchSamlOptions = options.fetchSamlOptions;
}

util.inherits(MultiSamlStrategy, SamlStrategy);

MultiSamlStrategy.prototype.authenticate = function (req, options) {
  var self = this;

  this._fetchSamlOptions(req, function (err, samlOptions) {
    if (err) {
      throw err;
    }

    self._saml = new saml.SAML(samlOptions);
    self.constructor.super_.prototype.authenticate.call(self, req, options);
  });
}

MultiSamlStrategy.prototype.logout = function (req, options) {
  var self = this;

  this._fetchSamlOptions(req, function (err, samlOptions) {
    if (err) {
      throw err;
    }

    self._saml = new saml.SAML(samlOptions);
    self.constructor.super_.prototype.logout.call(self, req, options);
  });
}

module.exports = MultiSamlStrategy;
