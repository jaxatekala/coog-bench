var $           = require('jquery'),
  Backbone      = require('backbone'),
  Session       = require('tryton-session');

Backbone.$ = $;

var BenchAppView  = require('./views/apps/benchmark.js'),
  LoginAppView    =  require('./views/apps/login.js');

var AppView = Backbone.View.extend({
  initialize: function() {
    this.is_logged().then(
      (session) => this.on_connection(session),
      () => {
        this.log = new LoginAppView();
        this.log.on('logged', this.on_connection, this);
        this.log.render();        
      });
  },

  on_connection: function(session) {
    this.session = session;
    console.log('CONNECTED');
    // save session
    this.session.pack().then((pack) => {
      sessionStorage.pack = pack;
      console.log(sessionStorage.pack);
    });
    // close login
    if (this.log) {
      this.log.close();
      this.log.remove();
      this.log = null;
    }
    // start BenchAppView
    this.bench = new BenchAppView(session);
    // listen to logout
  },

  on_logout: function() {
    this.session = null;
    console.log('LOGOUT');
    // close bench

    // start LoginAppView
    this.log = new LoginAppView();
    // listen to logged
    this.log.on('logged', this.on_connection, this);
    this.log.render();
  },

  is_logged: function() {
    if (typeof(Storage) === 'undefined') {
        console.log('Sorry! No Web Storage support..');
        return;
    }
    if (!sessionStorage.pack){
      return $.Deferred.reject();
    }
    return Session.unpack(sessionStorage.pack);
  }

});

$(() => {
  new AppView();
});
