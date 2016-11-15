var expect = require('expect.js');
var stub = require('sinon').stub;
var request = require('superagent');

var IframeHandler = require('../../src/helper/iframe-handler');
var information = require('../../src/helper/information');

var RequestMock = require('../mock/request-mock');

var WebAuth = require('../../src/web-auth');

describe('auth0.WebAuth', function () {
  context('paseHash', function () {
    before(function() {
      global.window = {};
      global.window.location = {};
      global.window.location.hash = '#access_token=asldkfjahsdlkfjhasd&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjoiMEhQNzFHU2Q2UHVvUllKM0RYS2RpWENVVWRHbUJidXAiLCJleHAiOjE0Nzg1NjIyNTMsImlhdCI6MTQ3ODUyNjI1M30.LELBxWWxcGdYTaE_gpSmlNSdcucqyrhuHQo-s7hTDBA&token_type=Bearer&state=theState&refresh_token=kajshdgfkasdjhgfas';
    });

    it('should parse a valid hash', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#access_token=VjubIMBmpgQ2W2&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjpbIjBIUDcxR1NkNlB1b1JZSjNEWEtkaVhDVVVkR21CYnVwIl0sImV4cCI6MTQ3ODU2MjI1MywiaWF0IjoxNDc4NTI2MjUzfQ.3x97RcBqXq9UE3isgbPdVlC0XdU7kQrPhaOFR-Fb4TA&token_type=Bearer&state=theState&refresh_token=kajshdgfkasdjhgfas'); // eslint-disable-line

      expect(data).to.eql({
        accessToken: 'VjubIMBmpgQ2W2',
        idToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjpbIjBIUDcxR1NkNlB1b1JZSjNEWEtkaVhDVVVkR21CYnVwIl0sImV4cCI6MTQ3ODU2MjI1MywiaWF0IjoxNDc4NTI2MjUzfQ.3x97RcBqXq9UE3isgbPdVlC0XdU7kQrPhaOFR-Fb4TA',
        idTokenPayload: {
          aud: ['0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup'],
          exp: 1478562253,
          iat: 1478526253,
          iss: 'https://mdocs.auth0.com/',
          sub: 'auth0|4AZDF56789'
        },
        refreshToken: 'kajshdgfkasdjhgfas',
        state: 'theState'
      });
    });

    it('should parse a valid hash from the location.hash', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash();

      expect(data).to.eql({
        accessToken: 'asldkfjahsdlkfjhasd',
        idToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjoiMEhQNzFHU2Q2UHVvUllKM0RYS2RpWENVVWRHbUJidXAiLCJleHAiOjE0Nzg1NjIyNTMsImlhdCI6MTQ3ODUyNjI1M30.LELBxWWxcGdYTaE_gpSmlNSdcucqyrhuHQo-s7hTDBA', // eslint-disable-line
        idTokenPayload: {
          aud: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
          exp: 1478562253,
          iat: 1478526253,
          iss: 'https://mdocs.auth0.com/',
          sub: 'auth0|4AZDF56789'
        },
        refreshToken: 'kajshdgfkasdjhgfas',
        state: 'theState'
      });
    });

    it('should parse a valid hash without id_token', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#access_token=VjubIMBmpgQ2W2&token_type=Bearer&state=theState&refresh_token=kajshdgfkasdjhgfas'); // eslint-disable-line

      expect(data).to.eql({
        accessToken: 'VjubIMBmpgQ2W2',
        idToken: undefined,
        idTokenPayload: undefined,
        refreshToken: 'kajshdgfkasdjhgfas',
        state: 'theState'
      });
    });

    it('should fail with an invalid audience', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3p',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#access_token=VjubIMBmpgQ2W2&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjoiMEhQNzFHU2Q2UHVvUllKM0RYS2RpWENVVWRHbUJidXAiLCJleHAiOjE0Nzg1NjIyNTMsImlhdCI6MTQ3ODUyNjI1M30.LELBxWWxcGdYTaE_gpSmlNSdcucqyrhuHQo-s7hTDBA&token_type=Bearer&state=theState&refresh_token=kajshdgfkasdjhgfas'); // eslint-disable-line

      expect(data).to.eql({
        error: 'invalid_token',
        error_description: 'The clientID configured (0HP71GSd6PuoRYJ3p) does not match with the clientID set in the token (0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup).' // eslint-disable-line
      });
    });

    it('should fail with an invalid issuer', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs_2.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#access_token=VjubIMBmpgQ2W2&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21kb2NzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw0QVpERjU2Nzg5IiwiYXVkIjoiMEhQNzFHU2Q2UHVvUllKM0RYS2RpWENVVWRHbUJidXAiLCJleHAiOjE0Nzg1NjIyNTMsImlhdCI6MTQ3ODUyNjI1M30.LELBxWWxcGdYTaE_gpSmlNSdcucqyrhuHQo-s7hTDBA&token_type=Bearer&state=theState&refresh_token=kajshdgfkasdjhgfas'); // eslint-disable-line

      expect(data).to.eql({
        error: 'invalid_token',
        error_description: 'The domain configured (https://mdocs_2.auth0.com/) does not match with the domain set in the token (https://mdocs.auth0.com/).' // eslint-disable-line
      });
    });


    it('should fail if there is no token', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs_2.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#token_type=Bearer&state=theState'); // eslint-disable-line

      expect(data).to.be(null);
    });

    it('should parse an error response', function () {
      var webAuth = new WebAuth({
        domain: 'mdocs_2.auth0.com',
        redirectURI: 'http://example.com/callback',
        clientID: '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        responseType: 'token'
      });

      var data = webAuth.parseHash('#error=the_error_code&error_description=the_error_description&state=some_state');

      expect(data).to.eql({
        error: 'the_error_code',
        error_description: 'the_error_description',
        state: 'some_state'
      });
    });
  });

  context('renewAuth', function () {
    after(function(){
      IframeHandler.prototype.init.restore();
    });

    it('it should pass the correct authorize url', function (done) {
      stub(information, 'error', function(message) {
        expect(message).to.be('Timeout during authentication renew.');
        done();
      });

      stub(IframeHandler.prototype, 'init', function(message) {
        expect(this.url).to.be('https://me.auth0.com/authorize?client_id=...&response_type=token&redirect_uri=http%3A%2F%2Fpage.com%2Fcallback&scope=openid%20name%20read%3Ablog&audience=urn%3Asite%3Ademo%3Ablog&prompt=none');
        this.timeoutCallback();
      });

      var webAuth = new WebAuth({
        domain: 'me.auth0.com',
        redirectURI: 'http://page.com/callback',
        clientID: '...',
        responseType: 'token',
        scope: 'openid name read:blog',
        audience: 'urn:site:demo:blog',
        _sendTelemetry: false
      });

      var options = {};

      webAuth.renewAuth(options, function (err, data) {});
    });
  });

  context('change password', function () {
    before(function () {
      this.auth0 = new WebAuth({
        domain: 'me.auth0.com',
        clientID: '...',
        redirectURI: 'http://page.com/callback',
        responseType: 'code',
        _sendTelemetry: false
      });
    });

    afterEach(function () {
      request.post.restore();
    });

    it('should call db-connection changePassword with all the options', function (done) {
      stub(request, 'post', function (url) {
        expect(url).to.be('https://me.auth0.com/dbconnection/change_password');
        return new RequestMock({
          body: {
            client_id: '...',
            connection: 'the_connection',
            email: 'me@example.com'
          },
          headers: {
            'Content-Type': 'application/json'
          },
          cb: function (cb) {
            cb(null, {});
          }
        });
      });

      this.auth0.changePassword({
        connection: 'the_connection',
        email: 'me@example.com'
      }, function (err) {
        expect(err).to.be(null);
        done();
      });
    });

    it('should call db-connection changePassword should ignore password option', function (done) {
      stub(request, 'post', function (url) {
        expect(url).to.be('https://me.auth0.com/dbconnection/change_password');
        return new RequestMock({
          body: {
            client_id: '...',
            connection: 'the_connection',
            email: 'me@example.com'
          },
          headers: {
            'Content-Type': 'application/json'
          },
          cb: function (cb) {
            cb(null, {});
          }
        });
      });

      this.auth0.changePassword({
        connection: 'the_connection',
        email: 'me@example.com',
        password: '123456'
      }, function (err) {
        expect(err).to.be(null);
        done();
      });
    });
  });

  context('passwordless start', function () {
    before(function () {
      this.auth0 = new WebAuth({
        domain: 'me.auth0.com',
        clientID: '...',
        redirectURI: 'http://page.com/callback',
        responseType: 'code',
        _sendTelemetry: false
      });
    });

    afterEach(function () {
      request.post.restore();
    });

    it('should call passwordless start sms with all the options', function (done) {
      stub(request, 'post', function (url) {
        expect(url).to.be('https://me.auth0.com/passwordless/start');
        return new RequestMock({
          body: {
            client_id: '...',
            connection: 'the_connection',
            phone_number: '123456'
          },
          headers: {
            'Content-Type': 'application/json'
          },
          cb: function (cb) {
            cb(null, {
              body: {}
            });
          }
        });
      });

      this.auth0.passwordlessStart({
        connection: 'the_connection',
        phoneNumber: '123456',
        type: 'sms'
      }, function (err, data) {
        expect(err).to.be(null);
        expect(data).to.eql({});
        done();
      });
    });

    it('should call passwordless start email with all the options', function (done) {
      stub(request, 'post', function (url) {
        expect(url).to.be('https://me.auth0.com/passwordless/start');
        return new RequestMock({
          body: {
            client_id: '...',
            connection: 'the_connection',
            email: 'me@example.com'
          },
          headers: {
            'Content-Type': 'application/json'
          },
          cb: function (cb) {
            cb(null, {
              body: {}
            });
          }
        });
      });

      this.auth0.passwordlessStart({
        connection: 'the_connection',
        email: 'me@example.com',
        type: 'email'
      }, function (err, data) {
        expect(err).to.be(null);
        expect(data).to.eql({});
        done();
      });
    });
  });
});
