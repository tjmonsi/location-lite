interface Window {
  HTMLElement: typeof HTMLElement,
  CustomEvent: typeof CustomEvent,
  decodeURIComponent (url)
  encodeURI (string)
  ga (name, event, eventCategory, eventAction, eventLabel, eventValue)
}

interface MouseEvent {
  composedPath ()
}

interface HTMLAnchorElement {
  origin: String
}


interface HTMLElement {
  attachShadow(mode)
  connectedCallback ()
  disconnectedCallback ()
  attributeChangedCallback (name, old, value)
  shadowRoot: typeof Element | Element | DocumentFragment | document
}
