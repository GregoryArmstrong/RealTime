var expect = require('chai').expect;
var assert = require('assert');
var request = require('request');
var app = require('../server');

describe('Server', function(){
  before(function(done){
    this.port = 3000;
    this.server = app.listen(this.port, function(error, result) {
      if (error) { return done(error); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:3000'
    });
  });

  after(function(){
    this.server.close();
  });

  it('exists', function() {
    assert(app);
  });

  describe('GET /', function() {

    it('should return a 200', function(done) {
      this.request.get('/', function(error, response){
        if (error) { return done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have the app name in the body', function(done){
      this.request.get('/', function(error, response){
        if (error) { return done(error); }
        assert(response.body.includes('Real Time'),
                `${response.body} does not include ${'title'}`)
        done();
      });
    });

    it('should return a 200 on /new_poll', function(done){
      this.request('/new_poll', function(error, response){
        if (error) { return done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should return a 404 and a "Poll not found." message', function(done){
      this.request('/poll/options', function(error, response){
        if (error) { return done(error); }
        assert.equal(response.statusCode, 404);
        assert(response.body.includes('Poll not found.'),
                `${response.body} does not include ${'title'}`)
        done();
      });
    });

    it('should return a 404 and a "Admin poll not found." message', function(done){
      this.request('/poll/admin/options', function(error, response){
        assert.equal(response.statusCode, 404);
        assert(response.body.includes('Admin Poll not found.'),
                `${response.body} does not include ${'title'}`)
        done();
      });
    });
  });
});
