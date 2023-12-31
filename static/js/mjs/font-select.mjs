/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.

// See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html ↵
// #reflecting-content-attributes-in-idl-attributes.

const installStringReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      const value = this.getAttribute(attrName);
      return value === null ? '' : value;
    },
    set(v) {
      this.setAttribute(attrName, v);
    },
  });
};

const installBoolReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      return this.hasAttribute(attrName);
    },
    set(v) {
      if (v) {
        this.setAttribute(attrName, '');
      } else {
        this.removeAttribute(attrName);
      }
    },
  });
};

// Observed attributes
const AUTOFOCUS = 'autofocus';
const VALUE = 'value';
const DISABLED = 'disabled';

// UI strings
const REGULAR = 'Regular';
const FONT_FAMILIES = 'Font Families';

// Other strings
const LI = 'li';
const DETAILS = 'details';
const SUMMARY = 'summary';
const UL = 'ul';
const SPAN = 'span';
const BUTTON = 'button';
const INPUT = 'input';
const HIGHLIGHT = 'highlight';
const OPTION = 'option';
const FAMILY = 'family';
const VARIATION = 'variation';
const CHANGE = 'change';
const GRANTED = 'granted';
const LOCAL_FONTS = 'local-fonts';
const TYPE_ERROR = 'TypeError';
const KEY_DOWN = 'keydown';
const FALSE_STRING = 'false';
const TRUE_STRING = 'true';
const CLICK = 'click';
const FOCUS = 'focus';
const BLUR = 'blur';
const POINTERDOWN = 'pointerdown';
const POINTEROVER = 'pointerover';
const POINTEROUT = 'pointerout';

// ARIA
const ARIA_EXPANDED = 'aria-expanded';
const ARIA_SELECTED = 'aria-selected';
const ARIA_ACTIVEDESCENDENT = 'aria-activedescendant';

// Keys
const ARROW_DOWN = 'ArrowDown';
const ARROW_UP = 'ArrowUp';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ESCAPE = 'Escape';
const ENTER = 'Enter';
const NUMPAD_ENTER = 'NumpadEnter';

// Uglify
const DOCUMENT = document;
const PERMISSIONS = navigator.permissions;

const template = DOCUMENT.createElement('template');
// eslint-disable max-len
template.innerHTML = `
  <style>
    *,
    ::before,
    ::after {
      box-sizing: border-box;
    }

    :host {
      --autocomplete-height: 10em;

      height: var(--input-height);
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    :host([disabled]),
    input[disabled] {
      cursor: not-allowed;
      pointer-events: none;
      color: GrayText;
    }

    ul {
      color: #454545;
      background-color: Canvas;
      position: absolute;
      margin: 0;
      list-style: none;
      padding-inline-start: 0.25em;
      overflow-y: scroll;
      max-height: var(--autocomplete-height);
      border: 1px solid #C1C1C1;
      border-radius: 0px 0px 5px 5px;
      background: #EDEDED;
      z-index: 1;
    }

    .variation {
      display: block;
      position: initial;
      overflow-y: initial;
      border: none;
      padding-inline-start: 1em;
    }

    li {
      font-size: 13px;
      color: #2b2b2b;
      user-select: none;
      cursor: default;
      white-space: nowrap;
      padding: 8px 0px 0px 2px;
    }

    input,
    button {
      font-size: inherit;
      background-color: #EDEDED;
      color: #454545;
    }

    input {
      cursor: pointer;
      width: 100%;
      font-family: Poppins;
      line-height: 1.3;
      font-size: 11px;
      font-weight: 600;
      height: var(--input-height);
      margin-inline-end: -1px;
      padding: 6px 8px 5px 8px;
      border: 1px solid #C1C1C1;
      border-right: 0px;
      border-radius: 5px 0px 0px 5px;
    }

    input:focus{
      border-radius: 5px 0px 0px 0px;
    }

    button:{
      width: 30px;
      border-radius: 0px 0px 0px 0px;
    }

    button:focus,
    input:focus,
    ul:focus {
      outline: none;
    }

    ul:focus{
      border-top: 0px;
    }

    button {
      appearance: none;
      border: 1px solid #C1C1C1;
      border-radius: 0px 5px 5px 0px;
      border-left: 0px;
      padding: 3px 8px 3px 8px;
      overflow: hidden;
    }

    button::before {
      content: "▸";
      color: GrayText;
      display: flex;
    }

    button[aria-expanded=true]::before {
      transform: rotate(-90deg);
    }

    button[aria-expanded=false]::before {
      transform: rotate(90deg);
    }

    input::-webkit-search-cancel-button {
      position:relative;
      right: -0.25em;
      appearance: none;
      width: 0.5em;
      height: 0.5em;
      background-image: url("static/img/icons/excluir.svg");
      background-size: 0.75em;
      background-position: center;
    }

    [part=font-family] {
      display: flex;
      width: fit-content;
      border-radius: 5px;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #9E9E9E;
        border-radius: 5px;
        transition: 0.5s background ease;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #848484;
    }

    .spacer {
      display: inline-block;
    }

    .highlight {
      background-color: #E3E3E3;
    }
  </style>
  <div>
    <div part="font-family">
      <input
        part="font-family-input"
        id="family"
        placeholder="Arial"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-controls="autocomplete"
        spellcheck="false"
      >
      <button
        tabindex="-1"
        aria-label="${FONT_FAMILIES}"
        aria-expanded="false"
        aria-controls="autocomplete"
      ></button>
    </div>
    <div class="spacer"></div>
    <ul
      tabindex="-1"
      part="font-family-preview"
      id="autocomplete"
      role="listbox"
      aria-label="${FONT_FAMILIES}"
      hidden
    ></ul>
  </div>`;

/**
 *
 *
 * @export
 * @class FontSelect
 * @extends {HTMLElement}
 */
export class FontSelect extends HTMLElement {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof FontSelect
   */
  static get observedAttributes() {
    return [AUTOFOCUS, DISABLED, VALUE];
  }

  /**
   *Creates an instance of FontSelect.
   * @memberof FontSelect
   */
  constructor() {
    super();

    installBoolReflection(this, DISABLED);
    installBoolReflection(this, AUTOFOCUS);
    installStringReflection(this, VALUE);

    this._initializeDOM();
  }

  /**
   *
   *
   * @return {bool}
   * @memberof FontSelect
   */
  async _requestPermission() {
    try {
      if (
        (await PERMISSIONS.request({ name: LOCAL_FONTS })).state !== GRANTED
      ) {
        return false;
      }
      return true;
    } catch (err) {
      // This simply means the permission isn't implemented yet.
      if (err.name === TYPE_ERROR) {
        return true;
      }
      throw err;
    }
  }

  /**
   *
   *
   * @param {*} value
   * @param {boolean} [exactMatch=false]
   * @memberof FontSelect
   */
  _filterFontPreview(value, exactMatch = false) {
    const lowerCaseValue = value.toLowerCase();
    let noMatches = true;
    this._fontPreviewList
      .querySelectorAll(`.${FAMILY}`)
      .forEach((fontPreviewItem) => {
        const value = fontPreviewItem.dataset.value.toLowerCase();
        const matches = exactMatch
          ? value === lowerCaseValue
          : value.includes(lowerCaseValue);
        if (matches) {
          noMatches = false;
          fontPreviewItem.hidden = false;
          return;
        }
        fontPreviewItem.hidden = true;
      });
    if (noMatches) {
      this._hideFontPreview();
    }
  }

  /**
   *
   *
   * @return {undefined}
   * @memberof FontSelect
   */
  _showFontPreview() {
    const { width, bottom } = this._wrapper.getBoundingClientRect();
    this._fontPreviewList.style.width = `${width}px`;
    this._fontPreviewList.style.top = `unset`;
    const fontPreviewItems = this._fontPreviewList.querySelectorAll(
      `.${FAMILY}`
    );
    this._index = -1;
    this._fontFamilyInput.setAttribute(ARIA_EXPANDED, true);
    this._fontFamilyButton.setAttribute(ARIA_EXPANDED, true);
    this._fontPreviewList.hidden = false;
    fontPreviewItems.forEach((fontPreviewItem) => {
      fontPreviewItem.hidden = false;
    });
  }

  /**
   *
   *
   * @memberof FontSelect
   */
  _hideFontPreview() {
    this._index = -1;
    this._fontFamilyInput.setAttribute(ARIA_EXPANDED, false);
    this._fontFamilyButton.setAttribute(ARIA_EXPANDED, false);
    this._fontPreviewList.hidden = true;
    this._fontPreviewList.querySelectorAll(LI).forEach((fontPreviewItem) => {
      fontPreviewItem.hidden = true;
      fontPreviewItem.classList.remove(HIGHLIGHT);
    });
    this._fontPreviewList.querySelectorAll(DETAILS).forEach((details) => {
      details.open = false;
    });
  }

  /**
   *
   *
   * @return {Array}
   * @memberof FontSelect
   */
  _getVisibleFontPreviewItems() {
    return Array.from(this._fontPreviewList.querySelectorAll(LI)).filter(
      (fontPreviewItem) => {
        return !fontPreviewItem.hidden;
      }
    );
  }

  /**
   *
   *
   * @param {*} value
   * @return {boolean}
   * @memberof FontSelect
   */
  _checkFontValue(value) {
    if (!value) {
      return true;
    }
    let valid = false;
    this._fontPreviewList.querySelectorAll(LI).forEach((fontPreviewItem) => {
      if (value === fontPreviewItem.dataset.value) {
        fontPreviewItem.setAttribute(ARIA_SELECTED, true);
        valid = true;
      }
    });
    return valid;
  }

  /**
   *
   *
   * @return {undefined}
   * @memberof FontSelect
   */
  async _initializeDOM() {
    this._index = -1;
    this._hover = false;
    this._closedWithButton = false;

    this._shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowRoot.append(template.content.cloneNode(true));

    this._fontFamilyInput = this._shadowRoot.querySelector(INPUT);
    this._fontFamilyButton = this._shadowRoot.querySelector(BUTTON);
    this._fontPreviewList = this._shadowRoot.querySelector(UL);
    this._wrapper = this._shadowRoot.querySelector('[part="font-family"]');

    if (!('queryLocalFonts' in self)) {
      return;
    }

    this._fontFamilyButton.addEventListener(CLICK, (e) => {
      if (this._fontFamilyButton.getAttribute(ARIA_EXPANDED) === FALSE_STRING) {
        this._closedWithButton = false;
        return this._fontFamilyInput.focus();
      }
      this._closedWithButton = true;
      this._hideFontPreview();
    });

    this._fontFamilyInput.addEventListener(FOCUS, async (e) => {
      if (this.disabled) {
        return;
      }
      if (await this._requestPermission()) {
        if (!this._closedWithButton) {
          this._closedWithButton = false;
          return this._showFontPreview();
        }
        this._closedWithButton = false;
      }
    });

    this.addEventListener(BLUR, (e) => {
      if (!this._hover) {
        this._closedWithButton = false;
        this._hideFontPreview();
      }
    });

    this._fontPreviewList.addEventListener(POINTERDOWN, (e) => {
      let clickedFontPreviewItem = e.target;
      const nodeName = clickedFontPreviewItem.nodeName.toLowerCase();
      if (![SPAN, LI, SUMMARY].includes(nodeName)) {
        return;
      }
      e.preventDefault();
      if (nodeName === SUMMARY) {
        const details = clickedFontPreviewItem.closest(DETAILS);
        if (!details) {
          return;
        }
        details.querySelectorAll(LI).forEach((fontFamilyPreviewItem) => {
          fontFamilyPreviewItem.hidden = false;
        });
        return;
      }
      clickedFontPreviewItem = clickedFontPreviewItem.closest(LI);
      clickedFontPreviewItem.setAttribute(ARIA_SELECTED, true);
      const value = clickedFontPreviewItem.dataset.value;
      this._fontFamilyInput.value = value;
      this.value = value;
      this._hideFontPreview();
    });

    this._fontPreviewList.addEventListener(POINTEROUT, (e) => {
      this._hover = false;
    });

    this._fontPreviewList.addEventListener(POINTEROVER, (e) => {
      this._hover = true;
      let hoveredFontPreviewItem = e.target;
      const nodeName = hoveredFontPreviewItem.nodeName.toLowerCase();
      if (![SPAN, LI, SUMMARY].includes(nodeName)) {
        return;
      }
      const visibleFontPreviewItems = this._getVisibleFontPreviewItems();
      this._fontFamilyInput.removeAttribute(ARIA_ACTIVEDESCENDENT);
      hoveredFontPreviewItem = hoveredFontPreviewItem.closest(LI);
      visibleFontPreviewItems.forEach((fontPreviewItem, i) => {
        if (fontPreviewItem === hoveredFontPreviewItem) {
          this._index = i;
          this._fontFamilyInput.setAttribute(
            ARIA_ACTIVEDESCENDENT,
            fontPreviewItem.dataset.value
          );
          return fontPreviewItem.classList.add(HIGHLIGHT);
        }
        fontPreviewItem.classList.remove(HIGHLIGHT);
      });
    });

    this._fontFamilyInput.addEventListener(KEY_DOWN, (e) => {
      const code = e.code;
      if (
        ![
          ARROW_DOWN,
          ARROW_UP,
          ARROW_LEFT,
          ARROW_RIGHT,
          ESCAPE,
          ENTER,
          NUMPAD_ENTER,
        ].includes(code)
      ) {
        return;
      }

      if (code === ARROW_LEFT || code === ARROW_RIGHT) {
        if (this._index === -1) {
          return;
        }
      }

      if (code === ARROW_UP || code === ARROW_DOWN) {
        if (
          this._fontFamilyInput.getAttribute(ARIA_EXPANDED) === FALSE_STRING
        ) {
          this._index = -1;
          this._showFontPreview();
          this._filterFontPreview(this._fontFamilyInput.value);
        }
      }

      e.preventDefault();

      if (code === ESCAPE) {
        this._fontFamilyInput.focus();
        if (this._fontFamilyInput.getAttribute(ARIA_EXPANDED) === TRUE_STRING) {
          return this._hideFontPreview();
        }
        this._fontFamilyInput.value = '';
        this.value = '';
        return this._showFontPreview();
      }

      const visibleFontPreviewItems = this._getVisibleFontPreviewItems();
      if (code === ENTER || code === NUMPAD_ENTER) {
        const selectedFontPreviewItem = visibleFontPreviewItems[this._index];
        if (selectedFontPreviewItem) {
          selectedFontPreviewItem.setAttribute(ARIA_SELECTED, true);
          const value = selectedFontPreviewItem.dataset.value;
          this._fontFamilyInput.value = value;
          this.value = value;
        }
        return this._hideFontPreview();
      }

      const numVisible = visibleFontPreviewItems.length;
      this._hover = false;
      if (code === ARROW_UP || code === ARROW_DOWN) {
        if (code === ARROW_DOWN) {
          this._index = ++this._index % numVisible;
        } else {
          this._index = this._index > 0 ? --this._index : numVisible - 1;
        }
        this._fontFamilyInput.removeAttribute(ARIA_ACTIVEDESCENDENT);
        visibleFontPreviewItems.forEach((fontPreviewItem, i) => {
          if (this._index === i) {
            fontPreviewItem.scrollIntoView({ block: 'nearest' });
            this._fontFamilyInput.setAttribute(
              ARIA_ACTIVEDESCENDENT,
              fontPreviewItem.dataset.value
            );
            return fontPreviewItem.classList.add(HIGHLIGHT);
          }
          fontPreviewItem.classList.remove(HIGHLIGHT);
        });
        return;
      }

      if (code === ARROW_LEFT || code === ARROW_RIGHT) {
        if (this._index === -1) {
          return;
        }
        visibleFontPreviewItems.forEach((fontPreviewItem, i) => {
          if (this._index === i) {
            if (code === ARROW_RIGHT) {
              const details = fontPreviewItem.querySelector(DETAILS);
              if (!details) {
                return;
              }
              details.open = true;
              details.querySelectorAll(LI).forEach((fontFamilyPreviewItem) => {
                fontFamilyPreviewItem.hidden = false;
              });
              return;
            }
            const details =
              fontPreviewItem.querySelector(DETAILS) ||
              fontPreviewItem.closest(DETAILS);
            details.querySelectorAll(LI).forEach((fontFamilyPreviewItem) => {
              fontFamilyPreviewItem.classList.remove(HIGHLIGHT);
              fontFamilyPreviewItem.hidden = true;
            });
            const fontFamilyPreviewItem = details.parentElement;
            fontFamilyPreviewItem.classList.add(HIGHLIGHT);
            this._index = Array.prototype.indexOf.call(
              this._fontPreviewList.querySelectorAll(`.${FAMILY}`),
              fontFamilyPreviewItem
            );
            details.open = false;
            return;
          }
        });
      }
    });

    this._fontFamilyInput.addEventListener(INPUT, (e) => {
      const value = this._fontFamilyInput.value;
      if (!value) {
        this.value = '';
        return this._showFontPreview();
      }
      this._filterFontPreview(value);
    });

    const _populateFontSelect = async (e) => {
      if (e instanceof PointerEvent) {
        this._fontFamilyInput.removeEventListener(INPUT, _populateFontSelect);
      } else {
        this._fontFamilyInput.removeEventListener(CLICK, _populateFontSelect);
      }
      const fonts = {};
      const styleSheet = new CSSStyleSheet();
      try {
        const pickedFonts = await queryLocalFonts();
        for (const metadata of pickedFonts) {
          if (!fonts[metadata.family]) {
            fonts[metadata.family] = [];
          }
          fonts[metadata.family].push(metadata);
        }
      } catch (err) {
        console.warn(err.name, err.message);
      }
      Object.keys(fonts)
        .sort()
        .forEach((fontFamily, index) => {
          const li = DOCUMENT.createElement(LI);
          li.className = FAMILY;
          li.dataset.value = fontFamily;
          const details = DOCUMENT.createElement(DETAILS);
          details.tabIndex = -1;
          const summary = DOCUMENT.createElement(SUMMARY);
          const span = DOCUMENT.createElement(SPAN);
          summary.append(span);
          const ul = DOCUMENT.createElement(UL);
          ul.className = VARIATION;
          li.role = OPTION;
          span.textContent = fontFamily;
          summary.style.fontFamily = fontFamily;
          details.append(summary);
          details.append(ul);
          li.append(details);
          this._fontPreviewList.append(li);
          fonts[fontFamily]
            .map((font) => {
              // Replace font variation name "Arial" with "Arial Regular".
              const variationName = font.fullName
                .replace(fontFamily, '')
                .trim();
              font.variationName = variationName ? variationName : REGULAR;
              return font;
            })
            .sort((a, b) => {
              // "Regular" always comes first, else use alphabetic order.
              if (a.variationName === REGULAR) {
                return -1;
              } else if (b.variationName === REGULAR) {
                return 1;
              } else if (a.variationName < b.variationName) {
                return -1;
              } else if (a.variationName > b.variationName) {
                return 1;
              }
              return 0;
            })
            .forEach((font) => {
              const detailsLi = DOCUMENT.createElement(LI);
              detailsLi.className = VARIATION;
              detailsLi.role = OPTION;
              detailsLi.style.fontFamily = font.fullName;
              detailsLi.dataset.value = font.fullName;
              detailsLi.hidden = true;
              detailsLi.textContent = font.variationName;
              ul.append(detailsLi);

              styleSheet.insertRule(`
                @font-face {
                  font-family: '${font.fullName}';
                  src: local('${font.fullName}'),
                      local('${font.postscriptName}');
                }`);
            });
        });
      DOCUMENT.adoptedStyleSheets = [
        ...DOCUMENT.adoptedStyleSheets,
        styleSheet,
      ];
      this._shadowRoot.adoptedStyleSheets = [styleSheet];
    };

    this._fontFamilyInput.addEventListener(CLICK, _populateFontSelect, {
      once: true,
    });
    this._fontFamilyInput.addEventListener(INPUT, _populateFontSelect, {
      once: true,
    });

    const { x, y, width, height } = this._wrapper.getBoundingClientRect();
    const spacer = this._shadowRoot.querySelector('.spacer');
    spacer.style.display = `none`;
    spacer.style.width = `${width}px`;
    spacer.style.height = `${height}px`;
    spacer.style.left = `${x}px`;
    spacer.style.top = `${y}px`;

    this.style.display = 'initial';

    if (this.autofocus) {
      this._fontFamilyInput.blur();
      this._fontFamilyInput.focus();
    }

    if (this.value) {
      const temp = this.value;
      this.value = '';
      this.value = temp;
      this._fontFamilyInput.value = this.value;
    } else {
      this.value = '';
    }

    if (this.disabled) {
      this._fontFamilyInput.disabled = true;
    }
  }

  /**
   *
   *
   * @param {*} name
   * @param {*} oldValue
   * @param {*} newValue
   * @memberof FontSelect
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === AUTOFOCUS) {
      if (this.autofocus) {
        this._fontFamilyInput.focus();
      }
    } else if (name === DISABLED) {
      this._fontFamilyInput.disabled = newValue;
    } else if (name === VALUE) {
      if (this._checkFontValue(newValue)) {
        this._fontFamilyInput.value = newValue;
        const customEvent = new CustomEvent(CHANGE, {
          detail: newValue,
        });
        this.dispatchEvent(customEvent);
      }
    }
  }
}

customElements.define('font-select', FontSelect);
