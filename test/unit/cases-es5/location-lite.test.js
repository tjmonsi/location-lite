(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  // @ts-nocheck
  /* eslint-disable no-undef */

  suite('LocationLite', function () {
    test('should have not be a HTMLUnknownElement constructor', function () {
      var el = document.querySelector('#test');
      expect(el.constructor.is).to.equal('location-lite');
    });

    test('should have a path equal to test path', function () {
      var el = document.querySelector('#test');
      expect(el.path).to.equal('/components/@littleq/location-lite/test/unit/location-lite.test.html');
    });

    test('should have the path equal to href when a user clicks on a link', function (done) {
      var el = document.querySelector('#test');
      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
      setTimeout(function () {
        expect(el.path).to.equal('/a');
        done();
      });
    });

    test('should have the path equal on path change event', function (done) {
      var el = document.querySelector('#test');
      var pathChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('path-change', pathChange);
        expect(detail).to.equal('/b');
        done();
      };
      el.addEventListener('path-change', pathChange);
      window.history.pushState({}, '', '/b');
      window.dispatchEvent(new window.CustomEvent('location-change'));
    });

    test('should have the path equal on click on anchor then path change event', function (done) {
      var el = document.querySelector('#test');
      var pathChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('path-change', pathChange);
        expect(detail).to.equal('/a');
        done();
      };
      el.addEventListener('path-change', pathChange);

      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
    });

    test('should have the query equal to href\'s query when a user clicks on a link', function (done) {
      var el = document.querySelector('#test');
      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
      setTimeout(function () {
        expect(el.query).to.equal('b=c&d=e');
        done();
      });
    });

    test('should have the query equal on query change event', function (done) {
      var el = document.querySelector('#test');
      var queryChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('query-change', queryChange);
        expect(detail).to.equal('g=f&h=1');
        done();
      };
      el.addEventListener('query-change', queryChange);
      window.history.pushState({}, '', '/b?g=f&h=1');
      window.dispatchEvent(new window.CustomEvent('location-change'));
    });

    test('should have the query equal on click on anchor then query change event', function (done) {
      var el = document.querySelector('#test');
      var queryChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('query-change', queryChange);
        expect(detail).to.equal('b=c&d=e');
        done();
      };
      el.addEventListener('query-change', queryChange);

      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
    });

    test('should have the hash equal to href\'s hash when a user clicks on a link', function (done) {
      var el = document.querySelector('#test');
      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
      setTimeout(function () {
        expect(el.hash).to.equal('f');
        done();
      });
    });

    test('should have the hash equal on hash change event', function (done) {
      var el = document.querySelector('#test');
      var hashChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('hash-change', hashChange);
        expect(detail).to.equal('h');
        done();
      };
      el.addEventListener('hash-change', hashChange);
      window.history.pushState({}, '', '/b?g=f&h=1#h');
      window.dispatchEvent(new window.CustomEvent('location-change'));
    });

    test('should have the hash equal on click on anchor then hash change event', function (done) {
      var el = document.querySelector('#test');
      var hashChange = function (ref) {
        var detail = ref.detail;

        el.removeEventListener('hash-change', hashChange);
        expect(detail).to.equal('f');
        done();
      };
      el.addEventListener('hash-change', hashChange);

      var a = document.querySelector('#anchor');
      MockInteractions.tap(a);
    });
  });

})));
