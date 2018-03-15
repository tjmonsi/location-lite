import { resolveUrl } from './lib/resolve-url.js';

export class LocationLite extends window.HTMLElement {
  static get is () { return 'location-lite'; }
  
  constructor () {
    super();
    this._boundHashChanged = this._hashChanged.bind(this);
    this._boundUrlChanged = this._urlChanged.bind(this);
    this._boundGlobalOnClick = this._globalOnClick.bind(this);
    this.attachShadow({ mode: 'close' });
  }
  
  connectedCallback () {
    window.addEventListener('hashchange', this._boundHashChanged);
    window.addEventListener('location-changed', this._boundUrlChanged);
    window.addEventListener('popstate', this._boundUrlChanged);
    document.body.addEventListener('click', this._boundGlobalOnClick, true);
    
    if (window.performance) {
      this._lastChangedAt = window.performance.now() - (this.dwellTime - 200);
    }
    this._initialized = true;

    this.dwellTime = 2000;
    this._initialized = false;
    this._urlChanged();
  }
  
  disconnectedCallback () {
    window.removeEventListener('hashchange', this._boundHashChanged);
    window.removeEventListener('location-changed', this._boundUrlChanged);
    window.removeEventListener('popstate', this._boundUrlChanged);
    document.body.removeEventListener('click', this._boundGlobalOnClick);
    this._initialized = false;
  }

  _hashChanged () {
    this.hash = window.decodeURIComponent(window.location.hash.slice(1));
    this.dispatchEvent(new window.CustomEvent('location-lite-hash-change', { detail: this.hash }));
  }
  
  _urlChanged () {
    // We want to extract all info out of the updated URL before we
    // try to write anything back into it.
    //
    // i.e. without _dontUpdateUrl we'd overwrite the new path with the old
    // one when we set this.hash. Likewise for query.
    this._dontUpdateUrl = true;
    this._hashChanged();
    
    this.path = window.decodeURIComponent(window.location.pathname);
    this.dispatchEvent(new window.CustomEvent('location-lite-path-change', { detail: this.path }));
    
    this.query = window.location.search.slice(1);
    this.dispatchEvent(new window.CustomEvent('location-lite-query-change', { detail: this.query }));

    this._dontUpdateUrl = false;
    this._updateUrl();
  }
  
  _getUrl () {
    var partiallyEncodedPath = window.encodeURI(this.path).replace(/\#/g, '%23').replace(/\?/g, '%3F'); // eslint-disable-line no-useless-escape
    var partiallyEncodedQuery = '';
    if (this.query) {
      partiallyEncodedQuery = '?' + this.query.replace(/\#/g, '%23'); // eslint-disable-line no-useless-escape
    }
    var partiallyEncodedHash = '';
    if (this.hash) {
      partiallyEncodedHash = '#' + window.encodeURI(this.hash);
    }
    return (partiallyEncodedPath + partiallyEncodedQuery + partiallyEncodedHash);
  }
  
  _updateUrl () {
    if (this._dontUpdateUrl || !this._initialized) {
      return;
    }

    if (this.path === window.decodeURIComponent(window.location.pathname) &&
        this.query === window.location.search.substring(1) &&
        this.hash === window.decodeURIComponent(window.location.hash.substring(1))) {
      // Nothing to do, the current URL is a representation of our properties.
      return;
    }
    var newUrl = this._getUrl();
    // Need to use a full URL in case the containing page has a base URI.
    var fullNewUrl = resolveUrl(newUrl, window.location.protocol + '//' + window.location.host).href;
    var now = window.performance ? window.performance.now() : null;
    var shouldReplace = this._lastChangedAt + this.dwellTime > now;
    this._lastChangedAt = now;
    if (shouldReplace) {
      window.history.replaceState({}, '', fullNewUrl);
    } else {
      window.history.pushState({}, '', fullNewUrl);
    }
    window.dispatchEvent(new window.CustomEvent('location-changed'));
  }
  
  /**
   * A necessary evil so that links work as expected. Does its best to
   * bail out early if possible.
   *
   * @param {MouseEvent} event .
   */
  _globalOnClick (event) {
    // If another event handler has stopped this event then there's nothing
    // for us to do. This can happen e.g. when there are multiple
    // iron-location elements in a page.
    if (event.defaultPrevented) {
      return;
    }
    var href = this._getSameOriginLinkHref(event);
    if (!href) {
      return;
    }
    event.preventDefault();
    // If the navigation is to the current page we shouldn't add a history
    // entry or fire a change event.
    if (href === window.location.href) {
      return;
    }

    window.history.pushState({}, '', href);
    window.dispatchEvent(new window.CustomEvent('location-changed'));
  }
  
  /**
   * Returns the absolute URL of the link (if any) that this click event
   * is clicking on, if we can and should override the resulting full
   * page navigation. Returns null otherwise.
   *
   * @param {MouseEvent} event .
   * @return {string?} .
   */
  _getSameOriginLinkHref (event) {
    // We only care about left-clicks.
    if (event.button !== 0) {
      return null;
    }
    // We don't want modified clicks, where the intent is to open the page
    // in a new tab.
    if (event.metaKey || event.ctrlKey) {
      return null;
    }
    var eventPath = event.composedPath();
    var anchor = null;
    for (var i = 0; i < eventPath.length; i++) {
      var element = eventPath[i];
      if (element.tagName === 'A' && element.href) {
        anchor = element;
        break;
      }
    }
    // If there's no link there's nothing to do.
    if (!anchor) {
      return null;
    }
    // Target blank is a new tab, don't intercept.
    if (anchor.target === '_blank') {
      // capture link click
      if (anchor.href && window.ga) {
        window.ga('send', 'event', 'Link', 'Click', anchor.href, 1);
      }
      return null;
    }
    // If the link is for an existing parent frame, don't intercept.
    if ((anchor.target === '_top' ||
        anchor.target === '_parent') &&
        window.top !== window) {
      return null;
    }
    var href = anchor.href;
    // It only makes sense for us to intercept same-origin navigations.
    // pushState/replaceState don't work with cross-origin links.
    var url;
    if (document.baseURI != null) {
      url = resolveUrl(href, /** @type {string} */(document.baseURI));
    } else {
      url = resolveUrl(href);
    }
    var origin;
    // IE Polyfill
    if (window.location.origin) {
      origin = window.location.origin;
    } else {
      origin = window.location.protocol + '//' + window.location.host;
    }
    var urlOrigin;
    if (url.origin) {
      urlOrigin = url.origin;
    } else {
      urlOrigin = url.protocol + '//' + url.host;
    }
    if (urlOrigin !== origin) {
      return null;
    }
    var normalizedHref = url.pathname + url.search + url.hash;
    // pathname should start with '/', but may not if `new URL` is not supported
    if (normalizedHref[0] !== '/') {
      normalizedHref = '/' + normalizedHref;
    }
    // If we've been configured not to handle this url... don't handle it!
    if (this._urlSpaceRegExp &&
        !this._urlSpaceRegExp.test(normalizedHref)) {
      return null;
    }
    // Need to use a full URL in case the containing page has a base URI.
    var fullNormalizedHref = resolveUrl(normalizedHref, window.location.href).href;
    return fullNormalizedHref;
  }
}

if (!window.customElements.get(LocationLite.is)) {
  window.customElements.define(LocationLite.is, LocationLite);
} else {
  console.warn(`${LocationLite.is} is already defined somewhere. Please check your code.`);
}