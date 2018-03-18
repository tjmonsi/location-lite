// @ts-nocheck
/* eslint-disable no-undef */

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
});
