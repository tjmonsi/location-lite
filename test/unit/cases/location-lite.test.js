// @ts-nocheck
/* eslint-disable no-undef */
var sinon = window.sinon;

suite('LocationLite', () => {
  test('should have not be a HTMLUnknownElement constructor', () => {
    const el = document.querySelector('#test');
    expect(el.constructor.is).to.equal('location-lite');
  });

  test('should have a path equal to test path', () => {
    const el = document.querySelector('#test');
    expect(el.path).to.equal('/components/@littleq/location-lite/test/unit/location-lite.test.html');
  });

  test('should have the path equal to href when a user clicks on a link', done => {
    const el = document.querySelector('#test');
    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
    setTimeout(() => {
      expect(el.path).to.equal('/a');
      done();
    });
  });

  test('should have the path equal on path change event', done => {
    const el = document.querySelector('#test');
    const pathChange = ({ detail }) => {
      el.removeEventListener('path-change', pathChange);
      expect(detail).to.equal('/b');
      done();
    };
    el.addEventListener('path-change', pathChange);
    window.history.pushState({}, '', '/b');
    window.dispatchEvent(new window.CustomEvent('location-change'));
  });

  test('should have the path equal on click on anchor then path change event', done => {
    const el = document.querySelector('#test');
    const pathChange = ({ detail }) => {
      el.removeEventListener('path-change', pathChange);
      expect(detail).to.equal('/a');
      done();
    };
    el.addEventListener('path-change', pathChange);

    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
  });

  test('should have the query equal to href\'s query when a user clicks on a link', done => {
    const el = document.querySelector('#test');
    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
    setTimeout(() => {
      expect(el.query).to.equal('b=c&d=e');
      done();
    });
  });

  test('should have the query equal on query change event', done => {
    const el = document.querySelector('#test');
    const queryChange = ({ detail }) => {
      el.removeEventListener('query-change', queryChange);
      expect(detail).to.equal('g=f&h=1');
      done();
    };
    el.addEventListener('query-change', queryChange);
    window.history.pushState({}, '', '/b?g=f&h=1');
    window.dispatchEvent(new window.CustomEvent('location-change'));
  });

  test('should have the query equal on click on anchor then query change event', done => {
    const el = document.querySelector('#test');
    const queryChange = ({ detail }) => {
      el.removeEventListener('query-change', queryChange);
      expect(detail).to.equal('b=c&d=e');
      done();
    };
    el.addEventListener('query-change', queryChange);

    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
  });

  test('should have the hash equal to href\'s hash when a user clicks on a link', done => {
    const el = document.querySelector('#test');
    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
    setTimeout(() => {
      expect(el.hash).to.equal('f');
      done();
    });
  });

  test('should have the hash equal on hash change event', done => {
    const el = document.querySelector('#test');
    const hashChange = ({ detail }) => {
      el.removeEventListener('hash-change', hashChange);
      expect(detail).to.equal('h');
      done();
    };
    el.addEventListener('hash-change', hashChange);
    window.history.pushState({}, '', '/b?g=f&h=1#h');
    window.dispatchEvent(new window.CustomEvent('location-change'));
  });

  test('should have the hash equal on click on anchor then hash change event', done => {
    const el = document.querySelector('#test');
    const hashChange = ({ detail }) => {
      el.removeEventListener('hash-change', hashChange);
      expect(detail).to.equal('f');
      done();
    };
    el.addEventListener('hash-change', hashChange);

    const a = document.querySelector('#anchor');
    MockInteractions.tap(a);
  });

  test('when path is set, should change window.location.pathname', done => {
    const el = document.querySelector('#test');
    el.path = '/search';
    setTimeout(() => {
      expect(window.location.pathname).to.equal('/search');
      done();
    });
  });

  test('when hash is set, should change window.location.hash', done => {
    const el = document.querySelector('#test');
    el.hash = 'hey';
    setTimeout(() => {
      expect(window.decodeURIComponent(window.location.hash.slice(1))).to.equal('hey');
      done();
    });
  });

  test('when query is set, should change window.location.search', done => {
    const el = document.querySelector('#test');
    el.query = 'a=b&c=d';
    setTimeout(() => {
      expect(window.location.search.slice(1)).to.equal('a=b&c=d');
      done();
    });
  });

  test('when path, hash, query is set, should return same results and also call _updateUrl once', done => {
    const el = document.querySelector('#test');
    sinon.spy(el, '_updateUrl');
    expect(el._updateUrl.callCount).to.equal(0);
    el.path = '/search/one';
    el.hash = 'hashtag2';
    el.query = 'e=f&g=h';
    setTimeout(() => {
      expect(window.location.pathname).to.equal('/search/one');
      expect(window.decodeURIComponent(window.location.hash.slice(1))).to.equal('hashtag2');
      expect(window.location.search.slice(1)).to.equal('e=f&g=h');
      expect(el._updateUrl.callCount).to.equal(1);
      done();
    });
  });
});
