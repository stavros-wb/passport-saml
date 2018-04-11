'use strict';

var sinon = require('sinon');
var should = require( 'should' );
var SamlStrategy = require( '../lib/passport-saml/index.js' ).Strategy;
var MultiSamlStrategy = require( '../lib/passport-saml/index.js' ).MultiSamlStrategy;

function verify () {}

describe('Strategy()', function() {
  it('extends passport Strategy', function() {
    function fetchSamlOptions () { return {} }
    var strategy = new MultiSamlStrategy({ fetchSamlOptions: fetchSamlOptions }, verify);
    strategy.should.be.an.instanceOf(SamlStrategy);
  });

  it('throws if wrong finder is provided', function() {
    function createStrategy (){ return new MultiSamlStrategy({}, verify) };
    should.throws(createStrategy);
   });
});

describe('strategy#authenticate', function() {
  beforeEach(function() {
    this.superAuthenticateStub = sinon.stub(SamlStrategy.prototype, 'authenticate');
  });

  afterEach(function() {
    this.superAuthenticateStub.restore();
  });

  it('calls super with request and auth options', function(done) {
    var superAuthenticateStub = this.superAuthenticateStub;
    function fetchSamlOptions (req, fn) {
      fn();
      sinon.assert.calledOnce(superAuthenticateStub);
      done();
    };

    var strategy = new MultiSamlStrategy({ fetchSamlOptions: fetchSamlOptions }, verify);
    strategy.authenticate();
  });

  it('passes options on to saml strategy', function(done) {
    var passportOptions = {
      passReqToCallback: true,
      authnRequestBinding: 'HTTP-POST',
      fetchSamlOptions: function (req, fn) {
        fn();
        strategy._passReqToCallback.should.eql(true);
        strategy._authnRequestBinding.should.eql('HTTP-POST');
        done();
      }
    };

    var strategy = new MultiSamlStrategy(passportOptions, verify);
    strategy.authenticate();
  });

  it('uses fetched options to setup internal saml provider', function(done) {
    var samlOptions = {
      issuer: 'http://foo.issuer',
      callbackUrl: 'http://foo.callback',
      cert: 'deadbeef',
      host: 'lvh',
      acceptedClockSkewMs: -1,
      identifierFormat:
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      path: '/saml/callback',
      logoutUrl: 'http://foo.slo',
      signatureAlgorithm: 'sha256'
    };

    function fetchSamlOptions (req, fn) {
      fn(null, samlOptions);
      strategy._saml.options.should.containEql(samlOptions);
      done();
    }

    var strategy = new MultiSamlStrategy(
      { fetchSamlOptions: fetchSamlOptions },
      verify
    );
    strategy.authenticate();
  });
});

describe('strategy#logout', function() {
  beforeEach(function() {
    this.superAuthenticateStub = sinon.stub(SamlStrategy.prototype, 'logout');
  });

  afterEach(function() {
    this.superAuthenticateStub.restore();
  });

  it('calls super with request and auth options', function(done) {
    var superAuthenticateStub = this.superAuthenticateStub;
    function fetchSamlOptions (req, fn) {
      fn();
      sinon.assert.calledOnce(superAuthenticateStub);
      done();
    };

    var strategy = new MultiSamlStrategy({ fetchSamlOptions: fetchSamlOptions }, verify);
    strategy.logout();
  });

  it('passes options on to saml strategy', function(done) {
    var passportOptions = {
      passReqToCallback: true,
      authnRequestBinding: 'HTTP-POST',
      fetchSamlOptions: function (req, fn) {
        fn();
        strategy._passReqToCallback.should.eql(true);
        strategy._authnRequestBinding.should.eql('HTTP-POST');
        done();
      }
    };

    var strategy = new MultiSamlStrategy(passportOptions, verify);
    strategy.logout();
  });

  it('uses fetched options to setup internal saml provider', function(done) {
    var samlOptions = {
      issuer: 'http://foo.issuer',
      callbackUrl: 'http://foo.callback',
      cert: 'deadbeef',
      host: 'lvh',
      acceptedClockSkewMs: -1,
      identifierFormat:
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      path: '/saml/callback',
      logoutUrl: 'http://foo.slo',
      signatureAlgorithm: 'sha256'
    };

    function fetchSamlOptions (req, fn) {
      fn(null, samlOptions);
      strategy._saml.options.should.containEql(samlOptions);
      done();
    }

    var strategy = new MultiSamlStrategy(
      { fetchSamlOptions: fetchSamlOptions },
      verify
    );
    strategy.logout();
  });
});
