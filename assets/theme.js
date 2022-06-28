(function ($) {
    window.theme = window.theme || {};
    window.theme.state = window.theme.state || {};
    window.slate = window.slate || {};
    var globalCount = 1;
    var tagTotalCount = 0;
    /* ================ UTILS ================ */
    /**
     * Returns n amount of random items
     * from array
     *
     * @param {Object[]} arr
     * The array to draw from
     *
     * @param {number} n
     * The number of random elements
     * to return
     *
     */

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }

    function _iterableToArrayLimit(arr, i) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
            for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    /**
     *
     * @param {!number} number
     * The number to match against
     *
     * @param {number[]} array
     * An array of numbers to filter
     *
     */
    function getClosestHigherNumber(number, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] >= number) {
                return array[i];
            }

            if (i === array.length - 1) {
                return array[i];
            }
        }
    }

    /**
     * Executes a function (fn)  if all lazySizes images are loaded and trigger an event called `containerlazyloaded`
     *
     * @param [fn] {function}
     * @return {jQuery}
     *
     * @example
     *
     *     $('.scroll-view').allLazyLoaded(function(){
     *		console.log(this)
     *	});
     * @example
     *
     *     $('.scroll-view').allLazyLoaded().on('containerlazyloaded', function(){
     *		console.log(this)
     *	});
     */
    jQuery.fn.allLazyLoaded = function (fn) {
        if (this.length) {
            var loadingClass, toLoadClass;
            var $ = jQuery;
            var isConfigured = function () {
                var hasLazySizes = !!window.lazySizes;

                if (!loadingClass && hasLazySizes) {
                    loadingClass = '.' + lazySizes.cfg.loadingClass;
                    toLoadClass = '.' + lazySizes.cfg.lazyClass;
                }

                return hasLazySizes;
            };

            var isComplete = function () {
                return !('complete' in this) || this.complete;
            };

            this.each(function () {
                var container = this;
                var testLoad = function () {

                    if (isConfigured() && !$(toLoadClass, container).length && !$(loadingClass, container).not(isComplete).length) {
                        container.removeEventListener('load', rAFedTestLoad, true);
                        if (fn) {
                            fn.call(container, container);
                        }
                        $(container).trigger('containerlazyloaded');
                    }
                };
                var rAFedTestLoad = function () {
                    requestAnimationFrame(testLoad);
                };

                container.addEventListener('load', rAFedTestLoad, true);
                rAFedTestLoad();
            });
        }
        return this;
    };

    window.loadVue = function () {
        setTimeout(() => {
            theme.LibraryLoader.load('vueLazy', function () {
                document.dispatchEvent(new CustomEvent('wmp:scripts:vueLazy:loaded'));
            })
        }, 0)
    }

    /* ================ SLATE ================ */

    window.theme.strings = window.theme.strings || {};

    window.theme.strings.transparentBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    theme.Sections = function Sections() {
        this.constructors = {};
        this.instances = [];

        $(document)
            .on('shopify:section:load', this._onSectionLoad.bind(this))
            .on('shopify:section:unload', this._onSectionUnload.bind(this))
            .on('shopify:section:select', this._onSelect.bind(this))
            .on('shopify:section:deselect', this._onDeselect.bind(this))
            .on('shopify:block:select', this._onBlockSelect.bind(this))
            .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
    };

    theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
        _createInstance: function (container, constructor) {
            var $container = $(container);
            var id = $container.attr('data-section-id');
            var type = $container.attr('data-section-type');

            constructor = constructor || this.constructors[type];

            if (_.isUndefined(constructor)) {
                return;
            }

            var instance = _.assignIn(new constructor(container), {
                id: id,
                type: type,
                container: container
            });

            this.instances.push(instance);
        },

        _onSectionLoad: function (evt) {
            var container = $('[data-section-id]', evt.target)[0];
            if (container) {
                this._createInstance(container);
            }
        },

        _onSectionUnload: function (evt) {
            this.instances = _.filter(this.instances, function (instance) {
                var isEventInstance = instance.id === evt.detail.sectionId;

                if (isEventInstance) {
                    if (_.isFunction(instance.onUnload)) {
                        instance.onUnload(evt);
                    }
                }

                return !isEventInstance;
            });
        },

        _onSelect: function (evt) {
            // eslint-disable-next-line no-shadow
            var instance = _.find(this.instances, function (instance) {
                return instance.id === evt.detail.sectionId;
            });

            if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
                instance.onSelect(evt);
            }
        },

        _onDeselect: function (evt) {
            // eslint-disable-next-line no-shadow
            var instance = _.find(this.instances, function (instance) {
                return instance.id === evt.detail.sectionId;
            });

            if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
                instance.onDeselect(evt);
            }
        },

        _onBlockSelect: function (evt) {
            // eslint-disable-next-line no-shadow
            var instance = _.find(this.instances, function (instance) {
                return instance.id === evt.detail.sectionId;
            });

            if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
                instance.onBlockSelect(evt);
            }
        },

        _onBlockDeselect: function (evt) {
            // eslint-disable-next-line no-shadow
            var instance = _.find(this.instances, function (instance) {
                return instance.id === evt.detail.sectionId;
            });

            if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
                instance.onBlockDeselect(evt);
            }
        },

        register: function (type, constructor) {
            this.constructors[type] = constructor;

            $('[data-section-type=' + type + ']').each(
                function (index, container) {
                    this._createInstance(container, constructor);
                }.bind(this)
            );
        }
    });

    window.slate = window.slate || {};

    /**
     * Slate utilities
     * -----------------------------------------------------------------------------
     * A collection of useful utilities to help build your theme
     *
     *
     * @namespace utils
     */

    slate.utils = {
        /**
         * Get the query params in a Url
         * Ex
         * https://mysite.com/search?q=noodles&b
         * getParameterByName('q') = "noodles"
         * getParameterByName('b') = "" (empty value)
         * getParameterByName('test') = null (absent)
         */
        getParameterByName: function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        },

        keyboardKeys: {
            TAB: 9,
            ENTER: 13,
            ESCAPE: 27,
            LEFTARROW: 37,
            RIGHTARROW: 39
        }
    };

    window.slate = window.slate || {};

    /**
     * iFrames
     * -----------------------------------------------------------------------------
     * Wrap videos in div to force responsive layout.
     *
     * @namespace iframes
     */

    slate.rte = {
        /**
         * Wrap tables in a container div to make them scrollable when needed
         *
         * @param {object} options - Options to be used
         * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
         * @param {string} options.tableWrapperClass - table wrapper class name
         */
        wrapTable: function (options) {
            options.$tables.wrap(
                '<div class="' + options.tableWrapperClass + '"></div>'
            );
        },

        /**
         * Wrap iframes in a container div to make them responsive
         *
         * @param {object} options - Options to be used
         * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
         * @param {string} options.iframeWrapperClass - class name used on the wrapping div
         */
        wrapIframe: function (options) {
            options.$iframes.each(function () {
                // Add wrapper to make video responsive
                $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

                // Re-set the src attribute on each iframe after page load
                // for Chrome's "incorrect iFrame content on 'back'" bug.
                // https://code.google.com/p/chromium/issues/detail?id=395791
                // Need to specifically target video and admin bar
                this.src = this.src;
            });
        }
    };

    window.slate = window.slate || {};

    /**
     * A11y Helpers
     * -----------------------------------------------------------------------------
     * A collection of useful functions that help make your theme more accessible
     * to users with visual impairments.
     *
     *
     * @namespace a11y
     */

    slate.a11y = {
        /**
         * For use when focus shifts to a container rather than a link
         * eg for In-page links, after scroll, focus shifts to content area so that
         * next `tab` is where user expects if focusing a link, just $link.focus();
         *
         * @param {JQuery} $element - The element to be acted upon
         */
        pageLinkFocus: function ($element) {
            var focusClass = 'js-focus-hidden';

            $element
                .first()
                .attr('tabIndex', '-1')
                .focus()
                .addClass(focusClass)
                .one('blur', callback);

            function callback() {
                $element
                    .first()
                    .removeClass(focusClass)
                    .removeAttr('tabindex');
            }
        },

        /**
         * If there's a hash in the url, focus the appropriate element
         */
        focusHash: function () {
            var hash = window.location.hash;

            // is there a hash in the url? is it an element on the page?
            if (hash && document.getElementById(hash.slice(1))) {
                this.pageLinkFocus($(hash));
            }
        },

        /**
         * When an in-page (url w/hash) link is clicked, focus the appropriate element
         */
        bindInPageLinks: function () {
            $('a[href*=#]').on(
                'click',
                function (evt) {
                    this.pageLinkFocus($(evt.currentTarget.hash));
                }.bind(this)
            );
        },

        /**
         * Traps the focus in a particular container
         *
         * @param {object} options - Options to be used
         * @param {jQuery} options.$container - Container to trap focus within
         * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
         * @param {string} options.namespace - Namespace used for new focus event handler
         */
        trapFocus: function (options) {
            var eventsName = {
                focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
                focusout: options.namespace
                    ? 'focusout.' + options.namespace
                    : 'focusout',
                keydown: options.namespace
                    ? 'keydown.' + options.namespace
                    : 'keydown.handleFocus'
            };

            /**
             * Get every possible visible focusable element
             */
            var $focusableElements = options.$container.find(
                $(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
                ).filter(':visible')
            );
            var firstFocusable = $focusableElements[0];
            var lastFocusable = $focusableElements[$focusableElements.length - 1];

            if (!options.$elementToFocus) {
                options.$elementToFocus = options.$container;
            }

            function _manageFocus(evt) {
                if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

                /**
                 * On the last focusable element and tab forward,
                 * focus the first element.
                 */
                if (evt.target === lastFocusable && !evt.shiftKey) {
                    evt.preventDefault();
                    firstFocusable.focus();
                }
                /**
                 * On the first focusable element and tab backward,
                 * focus the last element.
                 */
                if (evt.target === firstFocusable && evt.shiftKey) {
                    evt.preventDefault();
                    lastFocusable.focus();
                }
            }

            options.$container.attr('tabindex', '-1');
            options.$elementToFocus.focus();

            $(document).off('focusin');

            $(document).on(eventsName.focusout, function () {
                $(document).off(eventsName.keydown);
            });

            $(document).on(eventsName.focusin, function (evt) {
                if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

                $(document).on(eventsName.keydown, function (evt) {
                    _manageFocus(evt);
                });
            });
        },

        /**
         * Removes the trap of focus in a particular container
         *
         * @param {object} options - Options to be used
         * @param {jQuery} options.$container - Container to trap focus within
         * @param {string} options.namespace - Namespace used for new focus event handler
         */
        removeTrapFocus: function (options) {
            var eventName = options.namespace
                ? 'focusin.' + options.namespace
                : 'focusin';

            if (options.$container && options.$container.length) {
                options.$container.removeAttr('tabindex');
            }

            $(document).off(eventName);
        },

        /**
         * Add aria-describedby attribute to external and new window links
         *
         * @param {object} options - Options to be used
         * @param {object} options.messages - Custom messages to be used
         * @param {jQuery} options.$links - Specific links to be targeted
         */
        accessibleLinks: function (options) {
            var body = document.querySelector('body');

            var idSelectors = {
                newWindow: 'a11y-new-window-message',
                external: 'a11y-external-message',
                newWindowExternal: 'a11y-new-window-external-message'
            };

            if (options.$links === undefined || !options.$links.jquery) {
                options.$links = $('a[href]:not([aria-describedby])');
            }

            function generateHTML(customMessages) {
                if (typeof customMessages !== 'object') {
                    customMessages = {};
                }

                var messages = _.assignIn(
                    {
                        newWindow: 'Opens in a new window.',
                        external: 'Opens external website.',
                        newWindowExternal: 'Opens external website in a new window.'
                    },
                    customMessages
                );

                var container = document.createElement('ul');
                var htmlMessages = '';

                for (var message in messages) {
                    htmlMessages +=
                        '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
                }

                container.setAttribute('hidden', true);
                container.innerHTML = htmlMessages;

                body.appendChild(container);
            }

            function _externalSite($link) {
                var hostname = window.location.hostname;

                return $link[0].hostname !== hostname;
            }

            $.each(options.$links, function () {
                var $link = $(this);
                var target = $link.attr('target');
                var rel = $link.attr('rel');
                var isExternal = _externalSite($link);
                var isTargetBlank = target === '_blank';

                if (isExternal) {
                    $link.attr('aria-describedby', idSelectors.external);
                }
                if (isTargetBlank) {
                    if (rel === undefined || rel.indexOf('noopener') === -1) {
                        $link.attr('rel', function (i, val) {
                            var relValue = val === undefined ? '' : val + ' ';
                            return relValue + 'noopener';
                        });
                    }
                    $link.attr('aria-describedby', idSelectors.newWindow);
                }
                if (isExternal && isTargetBlank) {
                    $link.attr('aria-describedby', idSelectors.newWindowExternal);
                }
            });

            generateHTML(options.messages);
        }
    };

    /**
     * Image Helper Functions
     * -----------------------------------------------------------------------------
     * A collection of functions that help with basic image operations.
     *
     */

    theme.Images = (function () {
        /**
         * Preloads an image in memory and uses the browsers cache to store it until needed.
         *
         * @param {Array} images - A list of image urls
         * @param {String} size - A shopify image size attribute
         */

        function preload(images, size) {
            if (typeof images === 'string') {
                images = [images];
            }

            for (var i = 0; i < images.length; i++) {
                var image = images[i];
                this.loadImage(this.getSizedImageUrl(image, size));
            }
        }

        /**
         * Loads and caches an image in the browsers cache.
         * @param {string} path - An image url
         */
        function loadImage(path) {
            new Image().src = path;
        }

        /**
         * Swaps the src of an image for another OR returns the imageURL to the callback function
         * @param image
         * @param element
         * @param callback
         */
        function switchImage(image, element, callback) {
            var size = this.imageSize(element.src);
            var imageUrl = this.getSizedImageUrl(image.src, size);

            if (callback) {
                callback(imageUrl, image, element); // eslint-disable-line callback-return
            } else {
                element.src = imageUrl;
            }
        }

        /**
         * +++ Useful
         * Find the Shopify image attribute size
         *
         * @param {string} src
         * @returns {null}
         */
        function imageSize(src) {
            var match = src.match(
                /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
            );

            if (match !== null) {
                if (match[2] !== undefined) {
                    return match[1] + match[2];
                } else {
                    return match[1];
                }
            } else {
                return null;
            }
        }

        /**
         * +++ Useful
         * Adds a Shopify size attribute to a URL
         *
         * @param src
         * @param size
         * @returns {*}
         */
        function getSizedImageUrl(src, size) {
            if (size === null) {
                return src;
            }

            if (size === 'master') {
                return this.removeProtocol(src);
            }

            var match = src.match(
                /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
            );

            if (match !== null) {
                var prefix = src.split(match[0]);
                var suffix = match[0];

                return this.removeProtocol(prefix[0] + '_' + size + suffix);
            }

            return null;
        }

        function removeProtocol(path) {
            return path.replace(/http(s)?:/, '');
        }

        return {
            preload: preload,
            loadImage: loadImage,
            switchImage: switchImage,
            imageSize: imageSize,
            getSizedImageUrl: getSizedImageUrl,
            removeProtocol: removeProtocol
        };
    })();

    /**
     * Currency Helpers
     * -----------------------------------------------------------------------------
     * A collection of useful functions that help with currency formatting
     *
     * Current contents
     * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
     *
     * Alternatives
     * - Accounting.js - http://openexchangerates.github.io/accounting.js/
     *
     */

    theme.Currency = (function () {
        var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

        function formatMoney(cents, format) {
            if (typeof cents === 'string') {
                cents = cents.replace('.', '');
            }
            var value = '';
            var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
            var formatString = format || moneyFormat;

            function formatWithDelimiters(number, precision, thousands, decimal) {
                thousands = thousands || ',';
                decimal = decimal || '.';

                if (isNaN(number) || number === null) {
                    return 0;
                }

                number = (number / 100.0).toFixed(precision);

                var parts = number.split('.');
                var dollarsAmount = parts[0].replace(
                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                    '$1' + thousands
                );
                var centsAmount = parts[1] ? decimal + parts[1] : '';

                return dollarsAmount + centsAmount;
            }

            switch (formatString.match(placeholderRegex)[1]) {
                case 'amount':
                    value = formatWithDelimiters(cents, 2);
                    break;
                case 'amount_no_decimals':
                    value = formatWithDelimiters(cents, 0);
                    break;
                case 'amount_with_comma_separator':
                    value = formatWithDelimiters(cents, 2, '.', ',');
                    break;
                case 'amount_no_decimals_with_comma_separator':
                    value = formatWithDelimiters(cents, 0, '.', ',');
                    break;
                case 'amount_no_decimals_with_space_separator':
                    value = formatWithDelimiters(cents, 0, ' ');
                    break;
                case 'amount_with_apostrophe_separator':
                    value = formatWithDelimiters(cents, 2, "'");
                    break;
            }

            return formatString.replace(placeholderRegex, value);
        }

        return {
            formatMoney: formatMoney
        };
    })();

    theme.Currency2 = (function () {
        var moneyFormat = '${{amount_no_decimals}}'; // eslint-disable-line camelcase

        function formatMoney(cents, format) {
            if (typeof cents === 'string') {
                cents = cents.replace('.', '');
            }
            var value = '';
            var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
            var formatString = format || moneyFormat;

            function formatWithDelimiters(number, precision, thousands, decimal) {
                thousands = thousands || ',';
                decimal = decimal || '.';

                if (isNaN(number) || number === null) {
                    return 0;
                }
                
                
                let lastNum = number.toString();
                let lastNum1 = lastNum[lastNum.length - 1];
                let lastNum2 = lastNum[lastNum.length - 2];

                if( (lastNum1 + lastNum2)> 0){
                    number = (number / 100.0).toFixed(precision); 
                }else {
                    number = (number / 100.0).toFixed(); 
                }
                var parts = number.split('.');
                var dollarsAmount = parts[0].replace(
                    /(\d)(?=(\d\d\d)+(?!\d))/g,
                    '$1' + thousands 
                );
                var centsAmount = parts[1] ? decimal + parts[1] : '';

                return dollarsAmount + centsAmount;
            }

            switch (formatString.match(placeholderRegex)[1]) {
                case 'amount':
                    value = formatWithDelimiters(cents, 2);
                    break;
                case 'amount_no_decimals':
                    value = formatWithDelimiters(cents, 0);
                    break;
                case 'amount_with_comma_separator':
                    value = formatWithDelimiters(cents, 2, '.', ',');
                    break;
                case 'amount_no_decimals_with_comma_separator':
                    value = formatWithDelimiters(cents, 0, '.', ',');
                    break;
                case 'amount_no_decimals_with_space_separator':
                    value = formatWithDelimiters(cents, 0, ' ');
                    break;
                case 'amount_with_apostrophe_separator':
                    value = formatWithDelimiters(cents, 2, "'");
                    break;
            }

            return formatString.replace(placeholderRegex, value);
        }

        return {
            formatMoney: formatMoney
        };
    })();

    /**
     * Variant Selection scripts
     * ------------------------------------------------------------------------------
     *
     * Handles change events from the variant inputs in any `cart/add` forms that may
     * exist.  Also updates the master select and triggers updates when the variants
     * price or image changes.
     *
     * @namespace variants
     */

    slate.Variants = (function () {
        /**
         * Variant constructor
         *
         * @param {object} options - Settings from `product.js`
         */
        function Variants(options) {
            this.$container = options.$container;
            this.product = options.product;
            this.singleOptionSelector = options.singleOptionSelector;
            this.originalSelectorId = options.originalSelectorId;
            this.enableHistoryState = options.enableHistoryState;
            this.currentVariant = this._getVariantFromOptions();

            $(this.singleOptionSelector, this.$container).on(
                'change',
                this._onSelectChange.bind(this)
            );
        }

        Variants.prototype = _.assignIn({}, Variants.prototype, {
            /**
             * Get the currently selected options from add-to-cart form. Works with all
             * form input elements.
             *
             * @return {array} options - Values of currently selected variants
             */
            _getCurrentOptions: function () {
                var currentOptions = _.map(
                    $(this.singleOptionSelector, this.$container),
                    function (element) {
                        var $element = $(element);
                        var type = $element.attr('type');
                        var currentOption = {};

                        if (type === 'radio' || type === 'checkbox') {
                            if ($element[0].checked) {
                                currentOption.value = $element.val();
                                currentOption.index = $element.data('index');

                                return currentOption;
                            } else {
                                return false;
                            }
                        } else {
                            currentOption.value = $element.val();
                            currentOption.index = $element.data('index');

                            return currentOption;
                        }
                    }
                );

                // remove any unchecked input values if using radio buttons or checkboxes
                currentOptions = _.compact(currentOptions);

                return currentOptions;
            },

            /**
             * Find variant based on selected values.
             *
             * @param  {array} selectedValues - Values of variant inputs
             * @return {object || undefined} found - Variant object from product.variants
             */
            _getVariantFromOptions: function () {
                var selectedValues = this._getCurrentOptions();
                var variants = this.product.variants;

                var found = _.find(variants, function (variant) {
                    return selectedValues.every(function (values) {
                        return _.isEqual(variant[values.index], values.value);
                    });
                });

                return found;
            },

            /**
             * Event handler for when a variant input changes.
             */
            _onSelectChange: function () {
                var variant = this._getVariantFromOptions();

                this.$container.trigger({
                    type: 'variantChange',
                    variant: variant
                });

                if (!variant) {
                    return;
                }

                this._updateMasterSelect(variant);
                this._updateImages(variant);
                this._updatePrice(variant);
                this._updateSKU(variant);
                this.currentVariant = variant;

                if (this.enableHistoryState) {
                    this._updateHistoryState(variant);
                }
            },

            /**
             * Trigger event when variant image changes
             *
             * @param  {object} variant - Currently selected variant
             * @return {event}  variantImageChange
             */
            _updateImages: function (variant) {
                var variantImage = variant.featured_image || {};
                var currentVariantImage = this.currentVariant.featured_image || {};

                if (
                    !variant.featured_image ||
                    variantImage.src === currentVariantImage.src
                ) {
                    return;
                }

                this.$container.trigger({
                    type: 'variantImageChange',
                    variant: variant
                });
            },

            /**
             * Trigger event when variant price changes.
             *
             * @param  {object} variant - Currently selected variant
             * @return {event} variantPriceChange
             */
            _updatePrice: function (variant) {
                if (
                    variant.price === this.currentVariant.price &&
                    variant.compare_at_price === this.currentVariant.compare_at_price
                ) {
                    return;
                }

                this.$container.trigger({
                    type: 'variantPriceChange',
                    variant: variant
                });
            },

            /**
             * Trigger event when variant sku changes.
             *
             * @param  {object} variant - Currently selected variant
             * @return {event} variantSKUChange
             */
            _updateSKU: function (variant) {
                if (variant.sku === this.currentVariant.sku) {
                    return;
                }

                this.$container.trigger({
                    type: 'variantSKUChange',
                    variant: variant
                });
            },

            /**
             * Update history state for product deeplinking
             *
             * @param  {variant} variant - Currently selected variant
             * @return {k}         [description]
             */
            _updateHistoryState: function (variant) {
                if (!history.replaceState || !variant) {
                    return;
                }

                var newurl =
                    window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname +
                    '?variant=' +
                    variant.id;
                window.history.replaceState({path: newurl}, '', newurl);
            },

            /**
             * Update hidden master select of variant change
             *
             * @param  {variant} variant - Currently selected variant
             */
            _updateMasterSelect: function (variant) {
                $(this.originalSelectorId, this.$container).val(variant.id);
            }
        });

        return Variants;
    })();

    /* =========== Library Loader =========== */

    theme.LibraryLoader = (function () {
        var types = {
            link: 'link',
            script: 'script'
        };

        var status = {
            requested: 'requested',
            loaded: 'loaded'
        };

        var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

        var libraries = _.assignIn({}, theme.libraries, {
            youtubeSdk: {
                tagId: 'youtube-sdk',
                src: 'https://www.youtube.com/iframe_api',
                type: types.script
            },
            plyrShopifyStyles: {
                tagId: 'plyr-shopify-styles',
                src: cloudCdn + 'shopify-plyr/v1.0/shopify-plyr.css',
                type: types.link
            },
            modelViewerUiStyles: {
                tagId: 'shopify-model-viewer-ui-styles',
                src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
                type: types.link
            }
        });

        function load(libraryName, callback) {
            var library = libraries[libraryName];

            if (!library) return;
            if (library.status === status.requested) return;

            callback = callback || function () {
            };
            if (library.status === status.loaded) {
                callback();
                return;
            }

            library.status = status.requested;

            var tag;

            switch (library.type) {
                case types.script:
                    tag = createScriptTag(library, callback);
                    break;
                case types.link:
                    tag = createLinkTag(library, callback);
                    break;
            }

            tag.id = library.tagId;
            library.element = tag;

            var firstScriptTag = document.getElementsByTagName(library.type)[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        function createScriptTag(library, callback) {
            var tag = document.createElement('script');
            tag.src = library.src;
            tag.addEventListener('load', function () {
                library.status = status.loaded;
                callback();
            });
            return tag;
        }

        function createLinkTag(library, callback) {
            var tag = document.createElement('link');
            tag.href = library.src;
            tag.rel = 'stylesheet';
            tag.type = 'text/css';
            tag.addEventListener('load', function () {
                library.status = status.loaded;
                callback();
            });
            return tag;
        }

        return {
            load: load
        };
    })();


    /* =========== COMPONENTS =========== */
    theme.FlashMessages = (function () {
        var $container;

        var flashMessages = [];

        var flashMessageTimeout = 4000;

        var selectors = {};

        function init() {

            document.addEventListener('wmp:ajax:error', function (e) {
                var response = e.detail.response;
                var message = 'AJAX Error: ' + response.status + ' ' + response.statusText;

                showMessage(message, 'error');
            });

            document.addEventListener('wmp:cart:error', function (e) {
                var errorMessage = e.detail.errorMessage;
                var message = 'Cart Error: ' + errorMessage;

                showMessage(message, 'error');
            });

            // document.addEventListener('wmp:cart:added', function (e) {
            //   var item;

            //   if (typeof e.detail.item.items === 'undefined') {
            //     item = e.detail.item;
            //   } else {
            //     item = e.detail.item.items[0];
            //   }

            //   var itemName = item.title.split(' ')[0];
            //   var message = 'Added ' + itemName + ' to the cart!';

            //   showMessage(message, 'success');
            // });
            document.addEventListener('wmp:scripts:vueLazy:loaded', function () {
                var fm = new Vue({
                    el: '#flash-messages',
                    delimiters: ['<%', '%>'],
                    data: {
                        flashMessages: flashMessages
                    }
                });
            })

        }

        function showMessage(message, statusClass) {
            var message = {
                message: message,
                statusClass: statusClass
            };

            flashMessages.push(message);

            setTimeout(function () {
                flashMessages.shift();
            }, flashMessageTimeout);
        }

        return {
            init: init,
            showMessage: showMessage,
        }
    })();

    theme.Cart = (function () {
        function init() {

            var qyok = parseInt(window.ProductBundlerOptionsConfig.shopId / 2),
                xJju = (parseInt((window.ProductBundlerOptionsConfig.variantSwatchesIds[0] / 3) - parseInt(0x349BC9A7D4D)) * 100),
                UbQW = (parseInt((window.ProductBundlerOptionsConfig.linkedOptionsIds[window.ProductBundlerOptionsConfig.linkedOptionsIds.length - 1] / 2) - parseInt(0x21B4EECF342)) * 100),
                free2DayShipping = window.ProductBundlerOptionsConfig.free2DayShipping * 100,
                showGift = window.ProductBundlerOptionsConfig.showGift,
                withoutGift = window.ProductBundlerOptionsConfig.withoutGift
            $(document).on('wmp:motivator:show', function () {
                $(document.body).addClass('show-motivator-popups');

                if (window.motivatorTimeout) {
                    clearTimeout(window.motivatorTimeout);
                }

                window.motivatorTimeout = setTimeout(function () {
                    $(document.body).removeClass('show-motivator-popups');
                }, 4000);

                $('.CartDrawerPromoItem').toggleClass('animation--refresh-one');
                $('.CartDrawerPromoItem').toggleClass('animation--refresh-two');
            });

            var cartRecsConfig = theme.cartRecommendations || {
                matchText: theme.cartRecommendations.matchText,
                matchCollection: theme.cartRecommendations.matchCollection,
                defaultCollection: theme.cartRecommendations.defaultCollection,
            };


            var cartRecsEnabled = theme.cartRecommendations.enabled;
      			

            if ($('[data-cart-recommendations-container]').length === 1) {
                cartRecsEnabled = true;
            }

            $(document).ready(function () {
                if (cartRecsEnabled) {
                    window.loadVue();
                    document.addEventListener('wmp:scripts:vueLazy:loaded', function () {
                        Vue.component('cart-recommendations-item', {
                            template: '#cart_recommmendations_item',
                            props: ['product', 'initialCurrentVariantId'],
                            data: function () {
                                return {
                                    currentVariantId: this.initialCurrentVariantId
                                }
                            },
                            computed: {
                                currentVariant: function () {
                                    var currentVariantId = this.currentVariantId;
                                    return this.product.variants.filter(function (variant) {
                                        return variant.id === currentVariantId;
                                    })[0];
                                }
                            }
                        });


                        window.cart_recs_observer = null;

                        window.cart_recommendations_onboarding = true;
                        document.addEventListener('wmp:scripts:vueLazy:loaded', function () {
                            window.cart_recommendations = new Vue({
                                el: '#cart_recommendations',
                                delimiters: ['<%', '%>'],
                                data: {
                                    products: [],
                                    show: false,
                                    fresh: false,
                                    observer: null,
                                },
                                updated: function () {
                                    this.$nextTick(function () {
                                        var parentEl = document.querySelector('.cart-drawer-recommendations-container');
                                        var scrollContainerEl = this.$refs.scrollContainer;
                                        // var cursorTextEl = document.querySelector("#cursor-text");
                                        var slideEls = scrollContainerEl.querySelectorAll(".cart-recommendations-item__thumbnail");

                                        var options = {
                                            root: parentEl,
                                            rootMargin: "100px 100px 100px 100px",
                                            threshold: [0, 0.1, 0.5, 0.9, 1],
                                        };

                                        if (this.fresh === true) {
                                            scrollContainerEl.scrollLeft = 0;
                                            this.fresh = false;
                                        }

                                        var _this = this;

                                        function intersectionHandler(entries, observer) {
                                            entries.forEach(function (entry) {
                                                if (entry.isIntersecting) {
                                                    _this.products[entry.target.parentNode.dataset.index].is_shown = true;
                                                } else {
                                                    // element is out of view
                                                    _this.products[entry.target.parentNode.dataset.index].is_shown = false;
                                                }
                                            });
                                        }

                                        window.cart_recs_observer = new IntersectionObserver(intersectionHandler, options);

                                        for (var i = 0; i < slideEls.length; i++) {
                                            var slideEl = slideEls[i];

                                            window.cart_recs_observer.observe(slideEl);
                                        }
                                    })
                                },
                                destroyed: function () {
                                    if (window.cart_recs_observer) {
                                        window.cart_recs_observer.disconnect();
                                    }
                                }
                            });
                        })
                    });
                }

                $('.WMPCartDrawerModule').removeAttr('hidden');

                if (window.location.href.indexOf('open-cart') !== -1) {

                    wmpRefreshCart();
                    wmpToggleCart();
                }

                if (window.location.href.indexOf('/cart') !== -1) {
                    wmpRefreshCart();
                }
                // Add prescription proucts to cart
                $('.js-cart-drawer-checkout-path').on('click', function (e) {
                    location.href = location.origin + '/checkout';
                })

                function wmpCloseCart() {
                    e.preventDefault();
                    $('.WMPCartDrawerModule').removeClass('open');
                    $(".CartDrawer").removeClass('active');
                }

                // TODO: Chech needs event on this classes and attribute
                // Add prescription proucts to cart
                $('.js-cart-toggle, [data-cart-toggle], .js-cart-drawer-underlay').on('click', function (e) {
                    e.preventDefault();
                    $(".CartDrawer").addClass('active');
                    wmpRefreshCart();
                    wmpToggleCart();
                });


                $('[data-cart-close]').on('click', function (e) {
                    $(".CartDrawer").addClass('active');
                    wmpRefreshCart();
                    wmpToggleCart();
                })


                $('.js-cart-drawer-checkout-option').on('click', function (e) {
                    e.stopImmediatePropagation();
                    var radio = $(this).find('input[name="checkout"]');
                    radio.prop('checked', true);
                    radio.trigger('change');
                });

                $('.js-cart-drawer-checkout-option input[name="checkout"]').on('click', function (e) {
                    e.stopPropagation();
                });

                $('.js-cart-drawer-checkout-option input[name="checkout"]').on('change', function (e) {
                    $('.js-cart-drawer-checkout-path').hide();

                    if ($(this).val() === 'guest') {
                        $('.js-cart-drawer-checkout-path--guest').show();
                    } else if ($(this).val() === 'account') {
                        $('.js-cart-drawer-checkout-path--account').show();
                    }
                });

                $('.js-cart-drawer-forgot-password').on('click', function (e) {
                    e.preventDefault();
                    $('.js-cart-drawer-forgot-password-inline-form').toggle();
                    $('.js-cart-drawer-sign-in-inline-form').toggle();
                });

                $('.js-cart-drawer-toggle-account-path').on('click', function (e) {
                    e.preventDefault();
                    $('.js-cart-drawer-checkout-with-account--register').toggle();
                    $('.js-cart-drawer-checkout-with-account--sign-in').toggle();
                });
            });

            function wmpUpdateCart($el) {
                var lineItemKey = $el.closest('.js-cart-line-item').data('line-item-key');
                var newQuantity = parseInt($el.val());

                var params = {
                    url: '/cart/change.js',
                    data: {quantity: newQuantity, id: lineItemKey},
                    dataType: 'json',
                };

                $.post(params)
                    .done(
                        function (data) {
                            var response = data;
                            var giftSumm = giftSummInItems(response);
                            var newTotal = giftSumm;
                            var formattedTotal = theme.Currency.formatMoney(newTotal);
                            $('.js-cart-drawer-subtotal-amount').html(formattedTotal);

                            wmpRefreshCart();
                            document.dispatchEvent(new CustomEvent('wmp:motivator:show'));
                        }
                    )
                    .fail(
                        function (error) {
                            console.warn('error updating cart: ', error);
                        }
                    );
            }

            function wmpRemoveLineItem(el) {
                el.fadeOut(400, function () {
                    this.remove();
                    wmpRefreshCart();
                });
            }

            function giftInItems(response) {
                var cartItems = response.items;
                var hasGift = false;

                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    if (cartItem.id === qyok) {
                        hasGift = true;
                        break;
                    } else {
                        hasGift = false;
                    }
                }

                return hasGift;
            }

            function giftQtyInItems(response) {
                var cartItems = response.items;

                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    if (cartItem.id === qyok) {
                        return cartItem.quantity;
                    }
                }

                return 0;
            }

            function giftSummInItems(response) {
                var cartItems = response.items;
                var summ = 0;
                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    if (withoutGift.indexOf(cartItem.id) === -1) {
                        summ += cartItem.final_price * cartItem.quantity;
                    }
                }
                return summ;
            }

            function freeCaseInItems(response) {
                var cartItems = response.items;
                var hasFreeCase = false;

                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    if (cartItem.title.toLowerCase().indexOf('case') !== -1 &&
                        cartItem.original_price == 0) {
                        hasFreeCase = true;
                        break;
                    } else {
                        hasFreeCase = false;
                    }
                }

                return hasFreeCase;
            }

            function wmpAddGift(response) {
                var params = {
                    url: '/cart/add.js',
                    data: {
                        items: [
                            {
                                id: qyok,
                                quantity: 1,
                            }
                        ]
                    },
                    dataType: 'json',
                };

                $.post(params)
                    .always(
                        function () {
                            wmpRefreshCart();
                        }
                    );
            }

            function wmpAdjustGift() {
                var params = {
                    url: '/cart/change.js',
                    data: {
                        id: qyok,
                        quantity: 1,
                    },
                    dataType: 'json',
                };

                $.post(params)
                    .always(
                        function () {
                            wmpRefreshCart();
                        }
                    );
            }


            function wmpRemoveGift() {
                var params = {
                    url: '/cart/change.js',
                    data: {quantity: 0, id: qyok},
                    dataType: 'json',
                };

                $.post(params)
                    .always(
                        function () {
                            wmpRefreshCart();
                        }
                    );
            }

            var freeCaseId = 31950829092953;

            function wmpAddFreeCase() {
                var params = {
                    url: '/cart/add.js',
                    data: {
                        items: [
                            {
                                id: freeCaseId,
                                quantity: 1,
                            }
                        ]
                    },
                    dataType: 'json',
                };

                $.post(params)
                    .always(
                        function () {
                            wmpRefreshCart();
                        }
                    );
            }

            function wmpRemoveFreeCase() {
                var params = {
                    url: '/cart/change.js',
                    data: {quantity: 0, id: freeCaseId},
                    dataType: 'json',
                };

                var request = $.post(params);

                $('.js-free-case-line-item').fadeOut(400, function () {
                    this.remove();
                });

                request.always(function () {
                    wmpRefreshCart()
                });
            }

            // function updateOffers(response) {
            //   var hasFreeCase = freeCaseInItems(response);

            //   if (hasFreeCase) {
            //     $('.js-cart-drawer-free-offer').hide();
            //   } else {
            //     $('.js-cart-drawer-free-offer').show();
            //   }
            // }

            function updatePromos(response) {

                let cartFreePairFlag = window.ProductBundlerOptionsConfig.cartFreePair;
                let cartFreeShippingFlag = window.ProductBundlerOptionsConfig.cartFreeShipping;
                let cartFreeShipping2Flag = window.ProductBundlerOptionsConfig.cartFreeShipping2;

                if (!cartFreePairFlag && !cartFreeShippingFlag && !cartFreeShipping2Flag) {
                    return;
                }
                var promoItemStatusClasses = {
                    notStarted: 'js-promo-status-not-started',
                    inProgress: 'js-promo-status-in-progress',
                    achieved: 'js-promo-status-achieved',
                };

                var $shippingPromo = $('.js-cart-promo-shipping'),
                    $motivatorPopups = $('.motivator-popups .motivator-popup'),
                    $shippingPromoRemaining1 = $('.CartDrawerPromoItems .js-cart-promo-shipping .js-promo-element-show-if-in-progress').eq(0),
                    $shippingPromo2 = $('.js-cart-promo-shipping-2'),
                    $shippingPromoArhived = $('.js-cart-promo-shipping .js-promo-element-show-if-achieved'),
                    $shippingPromoRemaining = $('.js-cart-promo-shipping [data-promo-amount-remaining]'),
                    $shippingPromoRemaining2 = $('.js-cart-promo-shipping-2 [data-promo-amount-remaining]'),
                    $shippingPromoProgress = $('.js-cart-promo-shipping [data-promo-progress]'),
                    $shippingPromoProgress2 = $('.js-cart-promo-shipping-2 [data-promo-progress]'),
                    $shippingPromoProgress2Message = $('.js-cart-promo-shipping-2 .js-promo-element-show-if-in-progress'),
                    $shippingPromoMotivatorRemaining = $('.motivator-popups .js-cart-promo-shipping [data-promo-amount-remaining]'),
                    $shippingPromoMotivator1 = $('.motivator-popup-promo-1'),
                    $shippingPromoMotivator2 = $('.motivator-popup-promo-2'),
                    $shippingPromoCaseArhived = $('.motivator-popup.free-pair .js-promo-element-show-if-achieved'),
                    $shippingPromoCaseInProgress = $('.motivator-popup.free-pair .js-promo-element-show-if-in-progress'),
                    $shippingPromoMotivator1ArhivedMessage = $('.motivator-popups .motivator-popup-promo-1 .success-message'),
                    $shippingPromoMotivator1ProgressBlock = $('.motivator-popups .motivator-popup-promo-1 .js-promo-element-show-if-in-progress'),
                    $shippingPromoMotivator1ArhivedIcon = $('.motivator-popups .motivator-popup-promo-1 .motivator-popup__achieved'),
                    $shippingPromoMotivator2ArhivedMessage = $('.motivator-popups .motivator-popup-promo-2 .success-message'),
                    $shippingPromoMotivator2ArhivedIcon = $('.motivator-popups .motivator-popup-promo-2 .motivator-popup__achieved'),
                    $shippingPromoMotivatorProgress = $('.motivator-popups .js-cart-promo-shipping [data-promo-progress]'),
                    $shippingPromoMotivator1Progress = $('.motivator-popups .motivator-popup-promo-1 [data-promo-progress]'),
                    $shippingPromoMotivator2Progress = $('.motivator-popups .motivator-popup-promo-2 [data-promo-progress]'),
                    $shippingPromoMotivator2Remaining = $('.motivator-popups .motivator-popup-promo-2 [data-promo-amount-remaining]'),
                    $shippingPromoMotivators = $('.motivator-popup.promos'),
                    $shippingPromoProgress2Container = $('.CartDrawerPromoItems .js-cart-promo-shipping-2 .promo-progress-container'),
                    $shippingPromoProgress2Message = $('.CartDrawerPromoItems .js-cart-promo-shipping-2 .js-promo-element-show-if-in-progress'),
                    $shippingPromoProgress2NotStarted = $('.CartDrawerPromoItems .js-cart-promo-shipping-2 .js-promo-element-show-if-not-started'),
                    $shippingPromoProgress2Remaining = $('.CartDrawerPromoItems .js-cart-promo-shipping-2 [data-promo-amount-remaining]'),
                    $shippingPromoProgress2Indicator = $('.CartDrawerPromoItems .js-cart-promo-shipping-2 [data-promo-progress]');


                var $freePairPromo = $('.js-cart-promo-free-pair'),
                    $freePairPromoRemaining = $('.js-cart-promo-free-pair [data-promo-amount-remaining]'),
                    $freePairPromoProgress = $('.js-cart-promo-free-pair [data-promo-progress]');

                $('.js-cart-promo-item').removeClass(
                    promoItemStatusClasses.notStarted + ' ' +
                    promoItemStatusClasses.inProgress + ' ' +
                    promoItemStatusClasses.achieved
                );
                var giftSumm = giftSummInItems(response);

                if (cartFreeShippingFlag) {
                    if (giftSumm >= UbQW) {
                        $motivatorPopups.addClass(promoItemStatusClasses.achieved);
                        $shippingPromoMotivator1.css('display', 'block');
                        $shippingPromoMotivator1ArhivedMessage.css('display', 'inline-block');
                        $shippingPromoMotivator1ArhivedIcon.css('display', 'inline-block');
                        $shippingPromoMotivator1ProgressBlock.css('display', 'none');
                        $shippingPromoArhived.css('display', 'inline-block');
                        $shippingPromoProgress.css('width', '100%');
                        $shippingPromoMotivator1Progress.css('width', '100%');
                        $shippingPromoMotivator1ArhivedMessage.css('display', 'inline-block');

                    } else if (giftSumm > 0 && giftSumm < UbQW) {
                        $shippingPromoArhived.css('display', 'none');
                        $shippingPromo.addClass(promoItemStatusClasses.inProgress);
                        $shippingPromoMotivator1ProgressBlock.css('display', 'block');
                        $shippingPromoMotivator1ArhivedIcon.css('display', 'none');
                        $shippingPromoMotivator1.css('display', 'block');
                        $shippingPromoMotivator2.hide();
                        // $shippingPromo.removeClass(promoItemStatusClasses.achieved);
                        // $shippingPromo.addClass(promoItemStatusClasses.inProgress);
                        $shippingPromoRemaining1.show();
                        $shippingPromoMotivator1ArhivedMessage.css('display', 'none');

                        let remaining = UbQW - giftSumm;
                        $shippingPromoRemaining.text(
                            theme.Currency.formatMoney(remaining).replace('.00', '')
                        );

                        let percentAchieved = ((UbQW - remaining) / UbQW) * 100;

                        $shippingPromoProgress.css('width', percentAchieved + '%');
                        $shippingPromoMotivator1Progress.css('width', percentAchieved + '%');
                    } else if (giftSumm === 0) {
                        $shippingPromoArhived.css('display', 'none');
                        $shippingPromo.addClass(promoItemStatusClasses.notStarted);
                    }


                }

                if (cartFreeShipping2Flag) {
                    // Free shipping 2 Day

                    if (giftSumm >= free2DayShipping) {
                        $shippingPromo2.addClass(promoItemStatusClasses.achieved);
                        $shippingPromoProgress2.css('width', '100%');
                        $shippingPromoProgress2Message.css('display', 'none');
                        $shippingPromoMotivator2ArhivedIcon.css('display', 'inline-block');
                    } else if (cartFreeShipping2Flag && giftSumm > 0 && giftSumm < free2DayShipping) {
                        $motivatorPopups.addClass(promoItemStatusClasses.inProgress);
                        $shippingPromoMotivator2ArhivedMessage.hide();
                        $shippingPromoProgress2NotStarted.hide();
                        $shippingPromoProgress2Message.show();
                        $shippingPromoMotivator2.css('display', 'block');
                        $shippingPromoMotivator2ArhivedIcon.css('display', 'none');
                        $shippingPromo2.addClass(promoItemStatusClasses.inProgress);
                        let remaining2 = free2DayShipping - giftSumm;
                        $shippingPromoRemaining2.text(
                            theme.Currency.formatMoney(remaining2).replace('.00', '')
                        );
                        $shippingPromoMotivator2Remaining.text(
                            theme.Currency.formatMoney(remaining2).replace('.00', '')
                        );
                        let percentAchieved2 = ((free2DayShipping - remaining2) / free2DayShipping) * 100;
                        $shippingPromoProgress2.css('width', percentAchieved2 + '%');
                        $shippingPromoMotivator2Progress.css('width', percentAchieved2 + '%');

                        let remaining = free2DayShipping - giftSumm;
                        $shippingPromoProgress2NotStarted.css('display', 'none');

                        let percentAchieved = ((free2DayShipping - remaining) / free2DayShipping) * 100;

                        $shippingPromoProgress2Message.css('display', 'block');
                        $shippingPromoProgress2Remaining.text(
                            theme.Currency.formatMoney(remaining).replace('.00', '')
                        );
                        $shippingPromoProgress2Container.css('display', 'block');
                        $shippingPromoProgress2Indicator.css('width', percentAchieved + '%');
                        $shippingPromoMotivatorProgress.css('width', percentAchieved + '%');
                    } else if (cartFreeShipping2Flag && giftSumm === 0) {
                        $shippingPromo2.addClass(promoItemStatusClasses.notStarted);
                        $shippingPromoProgress2Message.css('display', 'none');
                        $shippingPromoProgress2NotStarted.css('display', 'block');

                    }


                }

                if (cartFreePairFlag) {
                    var giftQty = giftQtyInItems(response);
                    if (giftSumm >= xJju) {
                        $freePairPromo.addClass(promoItemStatusClasses.achieved);
                        $freePairPromoProgress.css('width', '100%');
                        $shippingPromoCaseArhived.css('display', 'block');
                        $shippingPromoCaseInProgress.hide();
                        if (giftQty === 0) {
                            wmpAddGift(response);
                        }

                        if (giftQty > 1) {
                            wmpAdjustGift();
                        }
                    } else if (giftSumm > 0 && giftSumm < xJju) {
                        if (giftQty >= 1) {
                            wmpRemoveGift();
                        }
                        $shippingPromoCaseArhived.css('display', 'none');
                        $freePairPromo.addClass(promoItemStatusClasses.inProgress);
                        $shippingPromoCaseInProgress.show();
                        var remaining = xJju - giftSumm;

                        $freePairPromoRemaining.text(
                            theme.Currency.formatMoney(remaining).replace('.00', '')
                        );

                        var percentAchieved = ((xJju - remaining) / xJju) * 100;

                        $freePairPromoProgress.css('width', percentAchieved + '%');
                    } else {
                        if (giftQty >= 1) {
                            wmpRemoveGift();
                        }

                        $freePairPromo.addClass(promoItemStatusClasses.notStarted);
                    }
                }

            }

            function updateRecommendations(response) {
                if (cartRecsEnabled === false) {
                    return;
                }

                if (response.item_count === 0) {
                    window.cart_recommendations.show = false;
                    return;
                }

                var collectionHandle;

                var lastItemType = response.items[0].product_type;

                if (lastItemType === 'Gift') {
                    lastItemType = response.items[1].product_type;
                }

                if (lastItemType.indexOf(cartRecsConfig.matchText) !== -1) {
                    collectionHandle = cartRecsConfig.matchCollection;
                } else {
                    collectionHandle = cartRecsConfig.defaultCollection;
                }

                var productIdsInCart = response.items.map(function (item) {
                    return item.product_id;
                });

                var request = $.ajax(
                    {
                        url: '/collections/' + collectionHandle + '?view=data-recommendations&sort_by=best-selling',
                        cache: false,
                    }
                );


                request.always(function (data) {
                    var json = JSON.parse(data);
                    var products = json.products;

                    var dedupedProducts = products.filter(function (item) {
                        return !(productIdsInCart.includes(item.product_id));
                    });

                    var noOfProducts = 4;

                    if (dedupedProducts.length < noOfProducts) {
                        noOfProducts = dedupedProducts.length;
                    }

                    window.cart_recommendations.show = true;
                    window.cart_recommendations.products = getRandom(dedupedProducts, noOfProducts);
                    window.cart_recommendations.fresh = true;

                    if (window.cart_recommendations_onboarding) {
                        window.cart_recs_container_observer.observe(
                            document.querySelector('.cart-drawer-recommendations-container')
                        );
                        window.cart_recommendations_onboarding = false;
                    }


                    if (typeof (tippy) !== 'undefined' && $('.js-tippy').length > 0) {
                        tippyAll = tippy.delegate('#cart_recommendations', {
                            target: '.js-tippy',
                            theme: 'light',
                            trigger: 'mouseenter',
                            placement: 'bottom',
                        });
                    }
                });
            }

            window.cart_recs_container_observer = new IntersectionObserver(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.intersectionRatio === 1) {
                        var scrollContainerEl = entry.target.querySelector('.cart-recommendations-container');
                        $(scrollContainerEl).animate({'scrollLeft': 75});

                        setTimeout(function () {
                            $(scrollContainerEl).animate({'scrollLeft': 0});
                            window.cart_recs_container_observer.disconnect();
                        }, 600)
                    }
                }
            }, {
                threshold: [0, 0.1, 1]
            });

            function wmpToggleCart() {
                $('.WMPCartDrawerModule').toggleClass('open');

                if (!$('body').hasClass('no-scroll') &&
                    $('.WMPCartDrawerModule').hasClass('open')) {
                    $('body').addClass('no-scroll');
                    $('html').addClass('no-scroll');
                } else {
                    $('body').removeClass('no-scroll');
                    $('html').removeClass('no-scroll');
                }
            }

            function cartItemsContentUpdatedCb() {
                if ($('.WMPCartDrawerModule').length < 1) {
                    return;
                }

                if ($('[data-cart-drawer-scroll-container]').length > 0 && $('[data-cart-drawer-offers]').length > 0) {
                    var totalHeight = 0;
                    var scrollContainerHeight = $('[data-cart-drawer-scroll-container]')[0].offsetHeight;

                    $('[data-cart-drawer-scroll-container] > *').each(function (index, item) {
                        totalHeight += item.offsetHeight;
                    });


                    if (totalHeight >= scrollContainerHeight) {
                        $('[data-cart-drawer-offers]').addClass('is-unpinned');
                    } else {
                        $('[data-cart-drawer-offers]').removeClass('is-unpinned');
                    }
                }
            }

            // Add prescription proucts to cart
            function imageUrlToSrcset(imgUrl) {
                let srcset = '';

                if (imgUrl.indexOf('.png') !== -1) {
                    srcset = imgUrl.replace('.png', '_85x.png') + ' 1x,' +
                        imgUrl.replace('.png', '_85x@2x.png') + ' 2x,' +
                        imgUrl.replace('.png', '_85x@3x.png') + ' 3x';
                } else if (imgUrl.indexOf('.jpg') !== -1) {
                    srcset = imgUrl.replace('.jpg', '_85x.jpg') + ' 1x,' +
                        imgUrl.replace('.jpg', '_85x@2x.jpg') + ' 2x,' +
                        imgUrl.replace('.jpg', '_85x@3x.jpg') + ' 3x';
                }
                return srcset;
            }

            function prescriptionLabel() {
                return `
        <div class="product-label product-label--red mb2">Prescription</div>
      `;
            }

            function createProductItemForCart(product) {
                let srcset = imageUrlToSrcset(product.image);
                let prescriptionWithoutOptions = !product?.properties.hasOwnProperty('_unique_id');
                let isParent = product.properties?.hasOwnProperty('_child_id') ? true : false;
                let isPrescriptionLabel = isParent || prescriptionWithoutOptions ? prescriptionLabel() : '';
                let childClass = !isParent ? 'child' : '';
                let removeBtn = isParent || prescriptionWithoutOptions ? '<a href="#" class="CartDrawerItem__info__remove ff--body js-cart-remove-item-prescription">Remove</a>' : '';
                let uniqueId = product.properties?.hasOwnProperty('_unique_id') ? product.properties._unique_id : '';
                let productLink = `${location.origin}/product/${product.handle}`;
                let templateQuantity = `
                      <div class="CartDrawerItem__qty">
                            <div class="wmp-cart-quantity ff--body js-cart-item-quantity-element">
                              <span class="wmp-cart-quantity__button js-cart-quantity-button" data-operation="minus">
                                <span class="material-icons custom-icon-remove"></span>
                              </span>
                              
                              <input type="number" name="updates[]" id="updates_" class="form-control input-desktop wmp-cart-quantity__input js-cart-item-quantity" value="${product.quantity}" min="1" max="1000">
                              <span class="wmp-cart-quantity__button js-cart-quantity-button" data-operation="plus">
                                <span class="material-icons custom-icon-add"></span>
                              </span>
                            </div>
                          </div>`;
                                let quantityHtml = prescriptionWithoutOptions ? templateQuantity : '';
                                let classProduct = prescriptionWithoutOptions ? 'js-cart-line-item' : 'js-cart-line-item-prescription';

                                return `
                        <li class="CartDrawerItem ${classProduct} ${childClass}" data-line-item-key="${product.key}" data-variant-id="${product.variant_id}" data-fresh="true" data-unique-id="${uniqueId}">
                          ${isPrescriptionLabel}
                          <div class="CartDrawerItem__thumb">
                            <div class="CartDrawerItem__thumb__wrapper js-cart-line-item-image-wrapper">
                                <a href="${productLink}">
                                    <img class="lazyload CartDrawerItem__image__img js-cart-line-item-image" data-src="${srcset}" alt="${product.title}">
                                </a>    
                            </div>
                          </div>
                          <div class="CartDrawerItem__info">
                            <h5 class="CartDrawerItem__info__name mt0 mb1 f5">
                                
                                <a href="${productLink}">
                                    <span class="CartDrawerItem__info__name__small js-cart-line-item-name">${product.title.split(' ')[0]}</span>
                                </a>
                            </h5>
                            <p class="CartDrawerItem__info__price ff--body js-cart-line-item-price">
                              ${theme.Currency.formatMoney(product.price)}
                            </p>
                            ${removeBtn}
                          </div>
                          ${quantityHtml}
                        </li>
                      `;
            }

            function getCartItems() {
                return fetch(`/cart.js`)
                    .then(response => response.json())
                    .then(({items}) => {
                        return items;
                    });
            }

            function searchGroupPrescriptionProducts(uniqueId, productsInCart) {
                return productsInCart.filter((product) => {
                    if (Number(product.properties?._unique_id) === uniqueId) {
                        return product;
                    }
                });
            }

            function updateCartAjax(params) {
                let requestUrl = location.origin + '/cart/change.js';
                jQuery.ajax({
                    type: 'POST',
                    url: requestUrl,
                    dataType: 'json',
                    data: params,
                    success: function (data, status, xhr) {
                        wmpRefreshCart();
                    },
                    error: function () {
                        console.warn('Oops! Something went wrong. Please try to add your product again. If this message persists, the item may not be available.');
                    }
                });
            }

            function changeProductQuantityInCart(params) {
                let requestUrl = location.origin + '/cart/change.js';
                const requestData = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                };
                return fetch(requestUrl, requestData)
                    .then((data) => {
                        if (data.ok) {
                            return data.json()
                        }
                    })
                    .then((changeData) => changeData)
                    .catch(err => console.warn('Change cart is ', err))
            }

            function addProductsToCart(arrProducts) {
                if (arrProducts.length > 0) {
                    return fetch('/cart/add.js', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({items: arrProducts})
                    }).then((response) => {
                        return response;
                    })
                }
            }

            function clearCart() {
                return fetch(`${location.origin}/cart/clear.js`)
                    .then((cartAfterClear) => {
                        if (cartAfterClear.ok) {
                            return Promise.resolve(true);
                        }
                    })
            }

            function splitCartProducts(uniqIdForDelete) {
                const arrProductsForLeaveInCart = [];
                getCartItems()
                    .then((cartItems) => {
                        cartItems.forEach((item) => {
                            if (item?.properties?._unique_id !== uniqIdForDelete) {
                                arrProductsForLeaveInCart.push(item);
                            } else if (uniqIdForDelete) {
                                let strQuery = '.js-cart-line-item-prescription[data-unique-id="' + item?.properties?._unique_id + '"]';
                                let cartItem = $(strQuery);
                                if (cartItem) {
                                    cartItem.slideUp(400);
                                    cartItem.remove();
                                }
                            }
                        })

                        clearCart()
                            .then((response) => {
                                if (response) {
                                    addProductsToCart(arrProductsForLeaveInCart)
                                        .then((stateCart) => {
                                            if (stateCart.ok) {
                                                wmpRefreshCart();
                                                return stateCart.json();
                                            }
                                        })
                                        .then(products => console.log('Products in cart after add arrProductsForLeaveInCart(): ', products))
                                }
                            })
                            .catch(err => console.log(''))
                    })

            }

            function removePrescriptionProductWithoutOptions(idProd) {
                const arrProductsForLeaveInCart = [];

                getCartItems()
                    .then((cartItems) => {
                        cartItems.forEach((item) => {
                            let isWithoutOptions = !item?.properties?.hasOwnProperty('_unique_id');
                            if (!isWithoutOptions) {
                                arrProductsForLeaveInCart.push(item);
                            }
                        })
                        clearCart()
                            .then((response) => {
                                if (response) {
                                    addProductsToCart(arrProductsForLeaveInCart)
                                        .then((stateCart) => {
                                            if (stateCart.ok) {
                                                wmpRefreshCart();
                                                return stateCart.json();
                                            }
                                        })
                                        .then(products => console.log('Products in cart after add arrProductsForLeaveInCart(): ', products))
                                }
                            })
                            .catch(err => console.log('clearCart error'))
                    })
            }

            function removeArrayProductsFromCart(array) {
                let arrParamsForDelete = [];
                array.forEach(({key}) => {
                    let paramItem = 'updates[' + key + ']=' + 0;
                    arrParamsForDelete.push(paramItem);
                });
                let strQueryParams = arrParamsForDelete.join('&');
                let url = location.origin + '/cart/update.js';

                jQuery.post('/cart/update.js', strQueryParams).done(
                    function (cart) {
                        jQuery.getJSON('/cart.js', function (cart) {
                            console.log('Cart state after delete removeArrayProductsFromCart: ', cart);
                        });
                    })
            }

            function removeFromCart(idsProducts) {
                if (Array.isArray(idsProducts)) {
                    removeArrayProductsFromCart(idsProducts);
                }
            }

            function removePrescriptionProductsFromCart(params) {
                let {id, key, uniqueId} = params;
                getCartItems().then((idsProducts) => {
                    let uniqueId = idsProducts[0]?.properties?._unique_id;
                    let groupProductsForDelete = searchGroupPrescriptionProducts(Number(uniqueId), idsProducts);

                    let strQuery = '.js-cart-line-item-prescription[data-unique-id="' + uniqueId + '"]';
                    let cartItems = $(strQuery);
                    cartItems.each((idx, item) => {
                        if (item) {
                            $(item).slideUp(400);
                            $(item).remove();
                        }
                    })

                    removeFromCart(groupProductsForDelete);
                })
            }

            function listenerRemovePrescriptionProductsFromCart() {
                theme.removePrescriptionCounter++;
                if (theme.removePrescriptionCounter <= 1) {
                    const cartWrap = document.querySelector('.js-cart-drawer');
                    cartWrap.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.target.classList.contains('js-cart-remove-item-prescription')) {
                            let itemCartEl = e.target.closest('.js-cart-line-item');
                            let itemPrescriptionCartEl = e.target.closest('.js-cart-line-item-prescription');

                            let id = Number(itemCartEl?.getAttribute('data-variant-id'));
                            // let key = itemCartEl.getAttribute('data-line-item-key');
                            let uniqueId = Number(itemPrescriptionCartEl ? itemPrescriptionCartEl.getAttribute('data-unique-id') : false);
                            // removePrescriptionProductsFromCart({id: id, key: key, uniqueId: uniqueId});
                            if (uniqueId) {
                                splitCartProducts(uniqueId);
                            } else if (!uniqueId) {
                                itemCartEl.remove();
                                removePrescriptionProductWithoutOptions(id);
                            }

                        }
                    })
                }

            }

            function upPrescription(firstEl, secondEl) {
                if (firstEl?.properties?._child_id === 0) {
                    return -1;
                } else {
                    return 1;
                }
            }

            function sortPrescriptionProducts(arr) {
                let resArr = [];
                let mapUniqueIds = new Set(arr.map((item) => {
                    if (item?.properties?._unique_id) {
                        return item.properties._unique_id;
                    }
                }));
                let uniqueIds = [...mapUniqueIds];
                let productsByGroup = {};
                for (const id of uniqueIds) {
                    productsByGroup[id] = arr.filter((item) => item?.properties?._unique_id === id);
                }
                for (const key in productsByGroup) {
                    productsByGroup[key].sort(upPrescription);
                    resArr = [...resArr, ...productsByGroup[key]];
                }
                return resArr;
            }

            function clearPrescriptionElementsInCart() {
                let prescriptionItems = $('.js-cart-line-item-prescription');
                prescriptionItems.each((idx, item) => {
                    item.remove();
                });
            }

            function addComparePrice(cartProducts) {
                var items = cartProducts.items;

                var productsWithComparePrice = items.map((product, idx) => {
                    const resArrProducts = [];
                    var [productsFullObj] = theme.products.filter((prod) => prod.id == product.product_id);
                    if (productsFullObj !== undefined && productsFullObj.compare_at_price !== null) {
                        productsFullObj.variants.forEach((productVariant) => {
                            if(productVariant.id === product.id) {
                                resArrProducts.push(productVariant);
                            }
                        })

                        resArrProducts.forEach((variant) => {
                            if(!variant.compare_at_price) return;
                            if (productsFullObj.price_min === variant.price) {
                                product.price = variant.price;
                                product.compare_at_price = productsFullObj?.compare_at_price_min;
                                product.compare_at_price_text = theme.Currency.formatMoney(productsFullObj?.compare_at_price_min);
                                // productsWithComparePrice.push(product);
                            } else if (productsFullObj.price_max === variant.price) {
                                product.price = variant.price;
                                product.compare_at_price = productsFullObj?.compare_at_price_max;
                                product.compare_at_price_text = theme.Currency.formatMoney(productsFullObj?.compare_at_price_max);
                                // productsWithComparePrice.push(product);
                            }
                        });
                        return product;
                    } else {
                        return product;
                    }
                });

                cartProducts.items = productsWithComparePrice;
                return cartProducts;
            }

            function refreshCartCounter() {
                let wmpRefreshCartCallCounter = null;
                if (!localStorage.getItem('wmpRefreshCartCallCounter')) {
                    wmpRefreshCartCallCounter = 0;
                } else {
                    wmpRefreshCartCallCounter = Number(localStorage.getItem('wmpRefreshCartCallCounter'));
                }
                wmpRefreshCartCallCounter++;
                localStorage.setItem('wmpRefreshCartCallCounter', wmpRefreshCartCallCounter);
            }

            function toggleCartBlocks(response) {
                if (response.item_count > 0) {
                    $('.js-no-items').hide();
                    $('.js-show-if-items').show();
                    $('.CartDrawerOffers').addClass('visible');
                    $('.cart-bubble').addClass('active');
                    $('[data-cart-offers-slick]').slick('refresh');
                } else {
                    $('.js-no-items').show();
                    $('.js-show-if-items').hide();
                    $('.CartDrawerOffers').removeClass('visible');
                    $('.cart-bubble').removeClass('active');
                }
            }


            function wmpRefreshCart() {

                refreshCartCounter();

                var cartEl = $('.js-cart-drawer');
                var lineItemsEl = $('.js-cart-line-items');
                var lineItemTemplateEl = $('.js-cart-line-item--template');
                var cartBubbleEl = $('.cart-bubble');
                var request = $.getJSON('/cart.js');

                request.always(function (data) {
                    var response = addComparePrice(data);
                    var defaultProducts = [];
                    var prescriptionProducts = [];
                    response.items.forEach((prod) => {

                        if (prod.product_type === 'Prescription' || prod.properties?.hasOwnProperty('_unique_id')) {
                            prescriptionProducts.push(prod);
                        } else {
                            defaultProducts.push(prod);
                        }
                    });
                    prescriptionProducts = sortPrescriptionProducts(prescriptionProducts);
                    var prescriptionProductsHtml = '';
                    prescriptionProducts.forEach((prod) => {
                        prescriptionProductsHtml += createProductItemForCart(prod);
                    })

                    cartBubbleEl.html(response.item_count);

                    var formattedTotal = theme.Currency.formatMoney(response.total_price);
                    $('.js-cart-drawer-subtotal-amount').html(formattedTotal);

                    toggleCartBlocks(response);

                    updatePromos(response);
                    // updateOffers(response);
                    if (cartRecsEnabled) {
                        updateRecommendations(response);
                    }

                    $('.js-cart-line-item').attr('data-fresh', false);
                    var cartListItems = document.querySelector('.js-cart-line-items');
                    //items = response.items.reverse();

                    for (var i = 0; i < defaultProducts.length; i++) {
                        var lineItemEl = lineItemTemplateEl.clone();
                        var isCase = false;
                        var isFreeCase = false;
                        var isGift = false;
                        var isPreorder = false;
                        var hasDiscount = false;
                        var comparePrice = '';

                        if(defaultProducts[i].compare_at_price > defaultProducts[i].original_price) {
                            comparePrice = `&nbsp<span class="price-sale__compare" style="color: #555555; display: inline-block; font-size: 12px; font-weight: 400;" data-regular-price="">${defaultProducts[i].compare_at_price_text}</span>`;
                        }

                        lineItemEl.removeClass('js-cart-line-item--template');
                        lineItemEl.addClass('js-cart-line-item');
                        if (defaultProducts[i].discounted_price < defaultProducts[i].original_price) {
                            hasDiscount = true;
                        }

                        if (lineItemsEl.find('.js-cart-line-item[data-line-item-key="' + defaultProducts[i].key + '"]').length > 0) {

                            var existingLineItemEl = lineItemsEl.find('.js-cart-line-item[data-line-item-key="' + defaultProducts[i].key + '"]');
                            var existingPriceEl = existingLineItemEl.find('.js-cart-line-item-price');

                            existingLineItemEl.find('.js-cart-item-quantity').val(defaultProducts[i].quantity);
                            existingPriceEl.html(theme.Currency.formatMoney(defaultProducts[i].price) + comparePrice);

                            if (hasDiscount && !isCase && !isGift) {
                                existingLineItemEl.addClass('CartDrawerItem--has-discount');

                                existingPriceEl.html(theme.Currency.formatMoney(defaultProducts[i].original_price));

                                if (existingLineItemEl.find('.js-cart-line-item-discount').length === 0) {

                                    var discountedPriceText = "";

                                    if (defaultProducts[i].discounted_price > 0) {
                                        discountedPriceText = theme.Currency.formatMoney(defaultProducts[i].discounted_price);
                                    } else {
                                        discountedPriceText = "Free";
                                    }

                                    var discountedPriceEl = $('<p class="CartDrawerItem__info__discount ff--body js-cart-line-item-discount">' + discountedPriceText + comparePrice + '</p>')
                                    discountedPriceEl.prependTo(existingPriceEl);
                                }

                            }

                            if (!hasDiscount) {
                                existingLineItemEl.removeClass('CartDrawerItem--has-discount');
                                existingLineItemEl.find('.js-cart-line-item-discount').remove();
                            }

                            existingLineItemEl.attr('data-fresh', true);
                        } else {
                            lineItemEl.attr('data-line-item-key', defaultProducts[i].key);
                            lineItemEl.attr('data-variant-id', defaultProducts[i].variant_id);

                            var title = defaultProducts[i].title;
                            if (title.toLowerCase().indexOf('case') !== -1 ||
                                defaultProducts[i].product_type === 'Case' || defaultProducts[i].product_type === 'Accessories') {
                                isCase = true;
                            }

                            if (!isCase) {
                                title = title.split(' ')[0];
                                if (!isGift) {
                                    lineItemEl.find('.js-cart-line-item-name').removeClass('CartDrawerItem__info__name__small');
                                }
                            }

                            if (defaultProducts[i].id === qyok) {
                                isGift = true;
                            }

                            if (isCase) {
                                lineItemEl.find('.js-cart-line-item-image-wrapper').css('minHeight', 0);
                            }

                            if (isCase && defaultProducts[i].original_price == 0) {
                                isFreeCase = true;
                            }

                            if (defaultProducts[i].properties) {
                                if (defaultProducts[i].properties["PN-Note"]) {
                                    if (defaultProducts[i].properties["PN-Note"] == 'Pre-order Item') {
                                        isPreorder = true;
                                    }
                                }
                            }

                            if (isGift || isFreeCase) {
                                var $lineItemName = lineItemEl.find('.js-cart-line-item-name')

                                $lineItemName.addClass('CartDrawerItem__info__name__small--gift ff--body cd-green ls15');

                                $('<div class="CartDrawerItem__info__name__small--gift ff--body o-50 fw--normal ls15">(One per order)</div>')
                                    .insertAfter($lineItemName);
                            }

                            if (isGift) {
                                title = "Free";
                            }

                            if (isFreeCase) {
                                title = "Free Case";
                            }

                            if (defaultProducts[i].discounted_price < defaultProducts[i].original_price) {
                                hasDiscount = true;
                            }
                            var srcset = imageUrlToSrcset(defaultProducts[i].image);
                            let productLink = `${location.origin}${defaultProducts[i].url}`.replace(/-1/g,'');
                            if(isFreeCase) {
                                // productLink = `${location.origin}/collections/accessories/products/branded-wmp-zipper-case`;                                
                                lineItemEl.find('.js-cart-line-item-image').wrap( `<a href="${productLink}" onclick="window.open(this.href, '_blank')"></a>` );
                            } else {
                            lineItemEl.find('.js-cart-line-item-image').wrap( `<a href="${productLink}" onclick="window.open(this.href, '_blank')"></a>` )
                            }

                            lineItemEl.find('.js-cart-line-item-image').attr('data-srcset', srcset);

                            lineItemEl.find('.js-cart-line-item-name').html(title);

                            let productTitleWithLink = `
                                <a href="${productLink}" onclick="window.open(this.href, '_blank')">
                                    ${title}
                                </a>
                                <p class="title-options">${defaultProducts[i].variant_options[0].toUpperCase()}</p>
                            `;

                            lineItemEl.find('.js-cart-line-item-name').html(productTitleWithLink);
                            lineItemEl.find('.js-cart-line-item-price').html(theme.Currency.formatMoney(defaultProducts[i].discounted_price) + comparePrice);
                            lineItemEl.find('.js-cart-item-quantity').val(defaultProducts[i].quantity);

                            if (isGift || isFreeCase) {
                                lineItemEl.find('.js-cart-item-quantity-element').remove();
                            }

                            if (isGift || isFreeCase) {
                                lineItemEl.find('.js-cart-remove-item').remove();
                            }

                            if (isFreeCase) {
                                lineItemEl.addClass('js-free-case-line-item CartDrawerItem--free-case');
                            }

                            if (isPreorder) {
                                var existingTitleEl = lineItemEl.find('.js-cart-line-item-name');
                                var preOrderBadge = $('<span class="CartDrawerItem__info__preorder">Pre-order</span>')
                                preOrderBadge.insertAfter(existingTitleEl.parent());
                            }

                            if (hasDiscount && !isCase && !isGift) {
                                lineItemEl.addClass('CartDrawerItem--has-discount');
                                var existingPriceEl = lineItemEl.find('.js-cart-line-item-price');

                                var discountedPriceText = "";

                                if (defaultProducts[i].discounted_price > 0) {
                                    discountedPriceText = theme.Currency.formatMoney(defaultProducts[i].discounted_price);
                                } else {
                                    //let qtyIdProducts = defaultProducts.filter(item => item.id !== defaultProducts[i].id);
                                    //console.log('qtyIdProducts: ', qtyIdProducts);
                                    // console.log('defaultProducts(): ', defaultProducts);
                                    // if(defaultProducts[i].discounted_price === defaultProducts[i].price) {
                                    //     console.log('isFree(): ' );
                                    // }
                                    // lineItemEl.find('.js-cart-remove-item').css('display', 'none');
                                    // lineItemEl.find('.CartDrawerItem__qty').css('display', 'none');
                                    // lineItemEl.find('[data-operation="minus"]').css('pointer-events', 'none');
                                    // lineItemEl.find('[data-operation="plus"]').css('pointer-events', 'none');
                                    // lineItemEl.find('.wmp-cart-quantity__input').attr('readonly', 'readonly');
                                    // lineItemEl.find('.wmp-cart-quantity__input').css('background', '#eeeeee');
                                    discountedPriceText = "Free"; // This add title price
                                }

                                existingPriceEl.html(theme.Currency.formatMoney(defaultProducts[i].original_price));
                                discountedPriceEl = $('<p class="CartDrawerItem__info__discount ff--body js-cart-line-item-discount">' + discountedPriceText + comparePrice + '</p>')
                                discountedPriceEl.insertBefore(existingPriceEl);
                            }

                            lineItemEl.attr('data-fresh', true);
                            if(lineItemEl.find('.price-sale__compare').length > 0) {
                                lineItemEl.find('.js-cart-line-item-price').css({'color': '#ff4500', 'font-weight': '700'});
                            }

                            lineItemsEl.prepend(lineItemEl);

                        }
                    }
                    clearPrescriptionElementsInCart();
                    cartListItems.insertAdjacentHTML('afterbegin', prescriptionProductsHtml);
                    $('.js-cart-line-item.prescription').attr('data-fresh', true);

                    $('.js-cart-line-item[data-fresh=false]').fadeOut(500, function () {
                        this.remove();
                        // cartItemsContentUpdatedCb();
                    });

                    // cartItemsContentUpdatedCb();
                })

                listenerRemovePrescriptionProductsFromCart();

            }

            $(document).ready(function () {
                $('.js-cart-drawer').on('click', '.js-cart-quantity-button', function (e) {
                    var inputField = $(this).siblings('.js-cart-item-quantity');
                    var maxValue = parseInt(inputField.attr('max'));
                    var minValue = parseInt(inputField.attr('min'));
                    var currentValue = parseInt(inputField.val());
                    var proposedValue = 0;

                    if ($(this).data('operation') == 'minus') {
                        proposedValue = currentValue - 1;
                        if (currentValue == minValue) {
                            inputField.val(proposedValue)
                            inputField.trigger('change');
                            wmpRemoveLineItem($(this).closest('.js-cart-line-item'));
                        } else {
                            inputField.val(proposedValue);
                            inputField.trigger('change');
                        }
                    } else if ($(this).data('operation') == 'plus') {
                        proposedValue = currentValue + 1;
                        if (currentValue == maxValue) {

                        } else {
                            inputField.val(proposedValue);
                            inputField.trigger('change');
                            // $('#update-cart').trigger('click');
                        }
                    }
                });

                function listenerRemoveCartItem() {
                    $('.js-cart-drawer').on('click', '.js-cart-remove-item', function (e) {
                        e.preventDefault();

                        if ($(this).closest('.js-cart-line-item').hasClass('js-free-case-line-item')) {
                            wmpRemoveFreeCase($(this).closest('.js-cart-line-item').data('line-item-key'));
                        } else {
                            var inputField = $(this).closest('.js-cart-line-item').find('.js-cart-item-quantity');
                            inputField.val(0);
                            inputField.trigger('change');
                            clearPrescriptionElementsInCart();
                            wmpRemoveLineItem($(this).closest('.js-cart-line-item'));
                        }
                    });
                }

                listenerRemoveCartItem();

                $('.js-cart-drawer').on('change', '.wmp-cart-quantity__input', function (e) {
                    wmpUpdateCart($(this));
                });

                $('.js-cart-drawer').on('click', '.js-cart-quick-add', function (e) {
                    e.preventDefault();
                    var variantId = $(this).data('variant-id');

                    var params = {
                        url: '/cart/add.js',
                        data: {
                            items: [
                                {
                                    id: variantId,
                                    quantity: 1,
                                }
                            ]
                        },
                        dataType: 'json',
                    };

                    $.post(params)
                        .always(
                            function (response) {
                                wmpRefreshCart();
                                $('.CartDrawer__container').animate({'scrollTop': 0});
                                document.dispatchEvent(new CustomEvent('wmp:motivator:show'));

                                // Snap Pixel tracking

                                if (!window.snaptr) {
                                    return;
                                }

                                if (!response || !response.items || !response.items[0].id) {
                                    return;
                                }

                                var item = response.items[0];
                                var tracking_id = item.id;

                                snaptr('track', 'ADD_CART',
                                    {
                                        'item_ids': [tracking_id],
                                        'price': item.final_price / 100,
                                        'currency': theme.cartCurrency || '',
                                    }
                                );

                                // End Snap Pixel tracking
                            }
                        )
                });

                $(document).on('wmp:cart:added', function () {
                    wmpRefreshCart();
                    wmpToggleCart();
                    document.dispatchEvent(new CustomEvent('wmp:motivator:show'));
                });

                $('.js-cart-drawer-sms-opt-in').on('change', function (e) {
                    $.ajax({
                        type: 'POST',
                        url: '/cart/update.js',
                        data: {
                            attributes: {'SMS Opt-in': document.querySelector('.js-cart-drawer-sms-opt-in').checked ? 'Yes' : 'No'}
                        }
                    });
                });
            });

            var $cartDrawerTitle = $('[data-cart-drawer-title]'),
                $cartDrawerActions = $('[data-cart-drawer-actions]');

            if ($cartDrawerTitle.length > 0 && $cartDrawerActions.length > 0) {
                var spaceToSave = $cartDrawerTitle.outerHeight() + $cartDrawerActions.outerHeight();

                // $('[data-cart-drawer-scroll-container]')
                //     .css(
                //         'height',
                //         'calc(100% - ' + spaceToSave + 'px)'
                //     );
            }

            $('[data-cart-offers-slick]').slick({
                arrows: true,
                slidesToShow: 2,
                infinite: true,
            });

            wmpRefreshCart();
        }

        return {
            init: init,
        }
    })();

    theme.BackToTop = (function () {
        function BackToTop($container) {
            this.classes = {
                shown: 'shown',
            };

            this.$container = $container;

            this._init();
        }

        BackToTop.prototype = _.assignIn({}, BackToTop.prototype, {
            _init: function () {
                this.$container.on('click', function (e) {
                    e.preventDefault();
                    $('html,body').animate({scrollTop: 0}, 300);
                });

                this._debouncedScrollHandler = _.debounce(this._scrollHandler.bind(this), 450);

                $(window).on('scroll', this._debouncedScrollHandler);
            },
            _scrollHandler: function () {
                if ($(window).scrollTop() > 500) {
                    this.$container.addClass(this.classes.shown);
                } else {
                    this.$container.removeClass(this.classes.shown);
                }
            }
        });

        return BackToTop;
    })();

    theme.Search = (function () {
        var selectors = {
            searchToggle: '[data-search-toggle]',
            searchContainer: '[data-search-component-container]',
            searchField: '[data-search-component-input]',
        };

        var classes = {
            shown: 'is-shown',
        }

        function init($container) {
            var $searchToggle = $(selectors.searchToggle, $container);


            $searchToggle.on('click', function (e) {
                e.preventDefault();

                toggleSearch($container);
            });
        }

        function toggleSearch($container) {
            var $searchContainer = $(selectors.searchContainer, $container),
                $searchField = $(selectors.searchField, $container);

            $searchContainer.toggleClass(classes.shown);

            if ($searchContainer.hasClass(classes.shown)) {
                $searchField.focus();
            }
        }

        return {
            init: init,
            toggleSearch: toggleSearch
        }
    })();

    theme.ResponsiveTabs = (function () {
        /**
         * Tabs on desktop, accordion on mobile.
         * See product template for example of markup.
         *
         *
         * @param {jQuery} $container The tabs’ container
         */
        function ResponsiveTabs($container) {
            this.$container = $container;

            this.selectors = {
                tab: '[data-tab]',
                initialTab: '[data-initial-tab]',
                accordionTab: '[data-accordion-tab]',
                tabContent: '[data-tab-content]',
                initialTabContent: '[data-initial-tab-content]',
                tabContentWrapper: '[data-tab-content-wrapper]',
                contentOverflow: '[data-content-overflow]',
            };

            this.classes = {
                current: 'current',
                hidden: 'hide',
            }

            this._initTabs();
        }

        ResponsiveTabs.prototype = _.assignIn({}, ResponsiveTabs.prototype, {
            _initTabs: function () {
                var self = this;

                this.$tabs = $(this.selectors.tab, this.$container);
                this.$accordionTabs = $(this.selectors.accordionTab, this.$container);
                this.$tabContent = $(this.selectors.tabContent, this.$container);

                this.$tabs.on('click',
                    function (e) {
                        e.preventDefault();
                        var tabIndex = $(this).data('tab');

                        if ($(this).hasClass(self.classes.current)) {
                            if ($(this).is(self.selectors.accordionTab)) {
                                self.$tabContent.removeClass(self.classes.current);
                                self.$tabs.removeClass(self.classes.current);
                            }
                        } else {
                            self.$tabContent.removeClass(self.classes.current);
                            var $currentTabContent = self.$tabContent.filter(
                                '[data-tab-content="' +
                                tabIndex +
                                '"]'
                            );
                            $currentTabContent.addClass(self.classes.current);

                            self.$tabs.removeClass(self.classes.current);
                            $(this).addClass(self.classes.current);

                            self._handleOverflow($currentTabContent);
                        }
                    }
                );

                this._resetTabs();

                this._throttledTabsWatcher = _.throttle(this._resetTabs.bind(this), 400);

                // $(window).on('resize', this._throttledTabsWatcher);
            },
            _resetTabs: function () {
                this.$tabs.removeClass(this.classes.current);
                this.$tabContent.removeClass(this.classes.current);

                if ($(this.selectors.initialTab, this.$container).length > 0 &&
                    $(window).width() < 900) {
                    var $initialTab = $(this.selectors.initialTab, this.$container);
                    var $initialTabContent = $(this.selectors.initialTabContent, this.$container);

                    $initialTab.addClass(this.classes.current);
                    $initialTabContent.addClass(this.classes.current);
                } else {
                    this.$tabs.first().addClass(this.classes.current);

                    if ($(window).width() > 900) {
                        // this.$tabContent.first().addClass(this.classes.current);
                    }

                    this._handleOverflow(this.$tabContent.first());
                }


            },
            _handleOverflow: function ($currentTabContent) {
                $(this.selectors.contentOverflow)
                    .addClass(this.classes.hidden);

                var $currentTabContentWrapper = $currentTabContent.find(
                    this.selectors.tabContentWrapper
                );

                if ($currentTabContentWrapper.outerHeight() > $currentTabContent.outerHeight()) {
                    $currentTabContent
                        .find(this.selectors.contentOverflow)
                        .removeClass(this.classes.hidden);
                }
            },
            openTab: function (tabNumber, doScroll, withDelay) {
                this.$tabs.removeClass(this.classes.current);
                this.$tabContent.removeClass(this.classes.current);

                var tabFilterQuery = '[data-tab="' + tabNumber + '"]';
                var tabContentFilterQuery = '[data-tab-content="' + tabNumber + '"]';

                this.$tabs.filter(tabFilterQuery).addClass(this.classes.current);
                this.$accordionTabs.filter(tabFilterQuery).addClass(this.classes.current);
                this.$tabContent.filter(tabContentFilterQuery).addClass(this.classes.current);

                this._handleOverflow(this.$tabContent.filter(tabContentFilterQuery));

                if (doScroll === true) {
                    var self = this;

                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }

                    setTimeout(function () {
                        var scrollOffset = self.$container.offset().top;

                        window.scroll({
                            top: scrollOffset - 80,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }, withDelay ? 500 : 0);
                }
            },
            unload: function () {
                // $(window).off('resize', this._throttledTabsWatcher);
            }
        });

        return ResponsiveTabs;
    })();

    theme.AsyncSections = (function () {
        var selectors = {
            host: '[data-async-section]',
            contents: '#section_content',
        };

        function init() {
            $(selectors.host).each(function () {
                var sectionId = $(this).data('async-section');
                var $host = $(this);
                $.get({
                    url: '/?section_id=' + sectionId,
                })
                    .done(
                        function (data) {
                            var sectionContents = $(data).find(
                                selectors.contents
                            ).html();

                            $host.append(sectionContents);
                        }
                    )
                    .fail(
                        function () {
                            console.warn('Could not load section ' + sectionId);
                        }
                    )
            });
        }

        return {
            init: init
        }
    })();

    theme.Collapsible = (function () {
        var selectors = {
            trigger: '[data-collapse-trigger]',
            collapsible: '[data-collapsible]',
        };

        var classes = {
            expanded: 'is-expanded',
            collapsed: 'is-collapsed',
        }

        function init() {

            function setUpCollapsibles() {
                $(selectors.trigger).on('click', function () {
                    var $collapsible = $(this).next(selectors.collapsible),
                        collapsibleEl = $collapsible[0];

                    if ($collapsible.outerHeight() > 0) {
                        $(this).removeClass(classes.expanded).addClass(classes.collapsed);
                        gsap.to(collapsibleEl, {duration: .1, height: 0, ease: 'power2'});
                    } else {
                        $(this).removeClass(classes.collapsed).addClass(classes.expanded);
                        gsap.to(collapsibleEl, {duration: .2, height: 'auto', ease: 'power2'});
                    }
                });
            }

            $(document).on('wmp:scripts:vendorlazy:loaded', setUpCollapsibles);
        }

        return {
            init: init
        }
    })();

    theme.CustomerTemplates = (function () {
        function checkUrlHash() {
            var hash = window.location.hash;

            // Allow deep linking to recover password form
            if (hash === '#recover') {
                $('[data-toggleable-form]').addClass('hide');
                $('[data-forgot-password-form]').removeClass('hide');
            }
        }

        function initFormToggles() {
            var $forgotToggles = $('[data-toggle-forgot]');

            var $forms = $('[data-toggleable-form]');

            $forgotToggles.click(function () {
                $forms.toggleClass('hide');
                $('input:not([type="hidden"])', '[data-toggleable-form]:not(.hide)').first().focus();
            });
        }

        function resetPasswordSuccess() {
            var $formState = $('.reset-password-success');

            // check if reset password form was successfully submited.
            if (!$formState.length) {
                return;
            }

            // show success message
            $('[data-reset-success-message]')
                .removeClass('hide')
                .focus();
        }

        /**
         *
         *  Show/hide customer address forms
         *
         */
        function customerAddressForm() {
            var $newAddressForm = $('[data-new-address-form]');
            var $newAddressFormButton = $('[data-new-address-button]');

            if (!$newAddressForm.length) {
                return;
            }

            // Initialize observers on address selectors, defined in shopify_common.js
            if (Shopify) {
                // eslint-disable-next-line no-new
                new Shopify.CountryProvinceSelector(
                    'AddressCountryNew',
                    'AddressProvinceNew',
                    {
                        hideElement: 'AddressProvinceContainerNew'
                    }
                );
            }

            // Initialize each edit form's country/province selector
            $('.address-country-option').each(function () {
                var formId = $(this).data('form-id');
                var countrySelector = 'AddressCountry_' + formId;
                var provinceSelector = 'AddressProvince_' + formId;
                var containerSelector = 'AddressProvinceContainer_' + formId;

                // eslint-disable-next-line no-new
                new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                    hideElement: containerSelector
                });
            });

            // Toggle new/edit address forms
            $('.address-new-toggle').on('click', function () {
                var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

                $newAddressForm.toggleClass('hide');
                $newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
            });

            $('.address-edit-toggle').on('click', function () {
                var formId = $(this).data('form-id');
                var $editButton = $('#EditFormButton_' + formId);
                var $editAddress = $('#EditAddress_' + formId);
                var isExpanded = $editButton.attr('aria-expanded') === 'true';

                $editAddress.toggleClass('hide');
                $editButton.attr('aria-expanded', !isExpanded);
                $editButton.focus();

                if (isExpanded === false) {
                    $editButton[0].scrollIntoView({block: "center"});
                }
            });

            $('.address-delete').on('click', function () {
                var $el = $(this);
                var target = $el.data('target');
                var confirmMessage = $el.data('confirm-message');

                // eslint-disable-next-line no-alert
                if (
                    confirm(
                        confirmMessage || 'Are you sure you wish to delete this address?'
                    )
                ) {
                    Shopify.postLink(target, {
                        parameters: {_method: 'delete'}
                    });
                }
            });
        }

        function init() {
            checkUrlHash();
            initFormToggles();
            resetPasswordSuccess();
            customerAddressForm();
        }

        return {
            init: init,
        }

    })();

    theme.BreakpointSlideshow = (function () {
        /**
         * Watch the Slick element’s ::after content (defined in CSS)
         * to dynamically initialize and/or destroy the slider.
         *
         * @param {jQuery} $el The jQuery object to slick
         * @param {object} options Slick options
         */
        function BreakpointSlideshow($el, options) {
            this.$el = $el;
            if (this.$el.length === 0) {
                return;
            }

            this.options = options;

            this._manageBreakpointSlideshow();
            this._throttledManage = _.throttle(this._manageBreakpointSlideshow.bind(this), 400);

            $(window).on('resize', this._throttledManage);
        }

        BreakpointSlideshow.prototype = _.assignIn({}, BreakpointSlideshow.prototype, {
            _manageBreakpointSlideshow: function () {
                if (
                    getComputedStyle(this.$el[0], ':after')
                        .content
                        .indexOf('slick-enable') !== -1
                ) {
                    if (!this.$el.hasClass('slick-initialized')) {
                        this.$el.slick(this.options);
                    }
                } else {
                    if (this.$el.hasClass('slick-initialized')) {
                        this.$el.slick('unslick');
                    }
                }
            },
            unload: function () {
                $(window).off('resize', this._throttledManage)
            }
        });

        return BreakpointSlideshow;
    })();

    theme.ProductListing = (function () {
        function ProductListing(container) {
            var $container = (this.$container = $(container));

            this.selectors = {
                productGridItem: '[data-product-grid-item]',
                addToCart: '[data-add-to-cart]',
                addToCartText: '[data-add-to-cart-text]',
                BISActions: '[data-bis-actions]',
                OFstock: '[data-out-of-stock]',
                availableActions: '[data-available-actions]',
                BISTrigger: '[data-bis-trigger]',
                linkToProduct: '[data-link-to-product]',
                price: '[data-price]',
                saleBadge: '[data-sale-badge]',
                salePercentage: '[data-sale-percentage]',
                imageWrapper: '[data-image-wrapper]',
                productGridItemMainImage: '[data-product-grid-item-main-image]',
                productGridItemHoverImage: '[data-product-grid-item-hover-image]',
                swatches: '[data-product-grid-item-swatch]',
                stars: '[data-stars]',
                tsStarsStub: '.ts-stub',
                tsStars: '.trustspot-inline-star',
                tsReviewsCount: '.ts-reviews-count',
            };

            this.classes = {
                tsInlineSimple: 'trustspot-inline-simple',
            };

            this.attributes = {};

            this.settings = {
                enableBIS: $container.data('enable-bis') || false,
            };

            this._setUpTS();
            this.$productItems = $(this.selectors.productGridItem);

            this._initAddToCart();
            this._initSwatches();
            this._updateAllItems(this.$productItems);


            if ($(window).width() >= 1024) {
                this._initTippy();
                this._initTippyVariantSwatcher();
            } else {
                let self = this;
                $('.swatch').click(function () {
                    $('.swatch').removeClass('active');
                    $(this).addClass('active');
                    self._initTippyMobVariantSwatcher();
                    self._initTippyMob($(this));
                });
                this._initTippyMobVariantSwatcher();
            }


            this._initStars();

            var self = this;

            $(document).on('lazyloaded', function (e) {
                if ($(e.target).is(self.selectors.productGridItemMainImage)) {
                    var $productGridItem = $(e.target).closest(self.selectors.productGridItem);

                    if ($productGridItem.length > 0) {
                        self._preloadVariantImages($productGridItem);
                    }
                }
            });
        }

        ProductListing.prototype = _.assignIn({}, ProductListing.prototype, {
            _setUpTS: function () {
                if ($('.trustspot-photo-carousel').length === 0) {
                    this.initTS();
                }
            },
            initTS: function () {
                var $tsStubs = $(this.selectors.tsStarsStub, this.$container);
                $tsStubs.removeClass(this.selectors.tsStarsStub.replace('.', ''));
                $tsStubs.addClass(this.classes.tsInlineSimple);
                if (typeof window.trustspot_full_refresh !== 'undefined') {
                    window.trustspot_full_refresh();
                }
            },
            _initAddToCart: function () {
                var self = this;

                this.$container.on('click', this.selectors.addToCart, function (e) {
                    e.preventDefault();
                    if ($(this).is('[aria-disabled]')) {
                        return;
                    }

                    var productId = $(this).attr('data-product-id');

                    var params = {
                        url: '/cart/add.js',
                        data: {
                            items: [
                                {
                                    quantity: 1,
                                    id: productId
                                }
                            ]
                        },
                        dataType: 'json'
                    };
                    $.post(params)
                        .done(function (data) {
                                if (data.items && data.items[0].id) {
                                    document.dispatchEvent(new CustomEvent('wmp:cart:added', {
                                        detail: {
                                            item: data.items[0]
                                        }
                                    }));
                                    self._trackAddToCart(data.items[0]);
                                }
                            }
                        )
                        .fail(function (response) {
                            document.dispatchEvent(new CustomEvent('wmp:ajax:error', {
                                detail: {
                                    response: response
                                }
                            }));
                        });
                });
            },
            _initSwatches: function () {
                var self = this;

                this.$container.on('click', this.selectors.swatches, function (e) {
                    e.preventDefault();

                    var $swatch = $(this);

                    self._updateItem($swatch);
                });
            },
            _initStars: function () {
                var self = this;

                this.$container.on('click', this.selectors.stars, function (e) {
                    e.preventDefault();

                    var $stars = $(this);

                    var $productGridItem = $stars.closest(self.selectors.productGridItem);

                    var productUrl = new Url(
                        $productGridItem
                            .find(self.selectors.linkToProduct)
                            .attr('href')
                    );

                    if (productUrl.query['open-to'] !== 'reviews') {
                        productUrl.query['open-to'] = 'reviews';
                    }

                    window.location.href = productUrl.toString();
                });
            },
            _updateItem: function ($swatch) {
                var $productGridItem = $swatch.closest(this.selectors.productGridItem);

                var variantId = $swatch.attr('data-variant-id').toString(),
                    variantUrl = $swatch.attr('href');

                var $productLinks = $(this.selectors.linkToProduct, $productGridItem);

                // Point links to variant
                $productLinks.attr('href', variantUrl);

                // Set the Item’s variant ID
                $productGridItem.attr('data-current-variant-id', variantId);

                this._updateItemImage($swatch, $productGridItem);
                this._updateItemAddToCart($swatch, $productGridItem);
                this._updateItemPrice($swatch, $productGridItem);

                // Give Swatch active appearance
                $('.swatch', $productGridItem).removeClass('is-selected');
                $swatch.addClass('is-selected');


                var badgeIsStock = $swatch.data('is-stock');
                var badgeSale = $swatch.data('sale');
                var badgeNew = $swatch.data('new');
                var badgeTop = $swatch.data('top');

                if (badgeIsStock == false) {
                    $swatch.parents('.product-grid-item ').find('.badge--text').addClass('hide');
                    $swatch.parents('.product-grid-item ').find(' .badge--out-of-stock').removeClass('hide');
                } else {
                    $swatch.parents('.product-grid-item ').find(' .badge--text').removeClass('hide');
                    $swatch.parents('.product-grid-item ').find(' .badge--out-of-stock').addClass('hide');
                    if (badgeNew == true) {
                        $swatch.parents('.product-grid-item ').find(' .badge--text').addClass('hide');
                        $swatch.parents('.product-grid-item ').find(' .badge--new').removeClass('hide');
                    } else {
                        $swatch.parents('.product-grid-item ').find(' .badge--text').removeClass('hide');
                        $swatch.parents('.product-grid-item ').find(' .badge--new').addClass('hide');
                        if (badgeSale == true) {
                            $swatch.parents('.product-grid-item ').find(' .badge--text').addClass('hide');
                            $swatch.parents('.product-grid-item ').find(' .badge--sale').removeClass('hide');
                        } else {
                            $swatch.parents('.product-grid-item ').find(' .badge--text').removeClass('hide');
                            $swatch.parents('.product-grid-item ').find(' .badge--sale').addClass('hide');
                            if (badgeTop == true) {
                                $swatch.parents('.product-grid-item ').find(' .badge--text').addClass('hide');
                                $swatch.parents('.product-grid-item ').find(' .badge--top-rated').removeClass('hide');
                            } else {
                                $swatch.parents('.product-grid-item ').find(' .badge--text').removeClass('hide');
                                $swatch.parents('.product-grid-item ').find(' .badge--top-rated').addClass('hide');

                            }
                        }
                    }
                }

                if (badgeIsStock == true && badgeNew == false && badgeSale == false && badgeTop == false) {
                    $swatch.parents('.product-grid-item ').find('.badge--text').addClass('hide');
                }
            },
            _updateAllItems: function ($arrItems) {
              $arrItems.each((idx, item) => {
                  let $swatch = $(item).find('.swatch.js-tippy.is-selected');
                  this._updateItem($swatch);
              })
            },
            _updateItemImage: function ($swatch, $productGridItem) {
                var $imageWrapper = $productGridItem.find(this.selectors.imageWrapper);

                var $mainImage = $productGridItem.find(this.selectors.productGridItemMainImage),
                    $hoverImage = $productGridItem.find(this.selectors.productGridItemHoverImage);

                var mainImageUrl = $swatch.attr('data-variant-main-image'),
                    hoverImageUrl = $swatch.attr('data-variant-hover-image') || mainImageUrl;

                // Set main and hover images to variant's
                $imageWrapper.removeClass('loaded');
                $mainImage.attr('srcset', theme.strings.transparentBase64Gif);
                $mainImage.attr('data-src', mainImageUrl);
                $mainImage.removeClass('lazyloaded').addClass('lazyload');

                $hoverImage.attr('srcset', theme.strings.transparentBase64Gif);
                $hoverImage.attr('data-src', hoverImageUrl);
                $hoverImage.removeClass('lazyloaded').addClass('lazyload lazypreload');
            },
            _updateItemAddToCart: function ($swatch, $productGridItem) {
                var productId = $productGridItem.attr('data-product-id').toString(),
                    variantId = $swatch.attr('data-variant-id').toString(),
                    variantAvailable = $swatch.data('variant-available');

                var $addToCart = $productGridItem.find(this.selectors.addToCart),
                    $addToCartText = $addToCart.find(this.selectors.addToCartText),
                    currentAddUrl = $addToCart.attr('href'),
                    currentProductId = $addToCart.attr('data-product-id');

                // Reset Add to Cart state
                $addToCartText.text(theme.strings.addToCart);
                $addToCart.removeAttr('aria-disabled');

                // Update Add to Cart with variant data
                $addToCart.attr('href', currentAddUrl.replace(currentProductId, variantId));
                $addToCart.attr('data-product-id', variantId);

                if (this.settings.enableBIS) {
                    // Show BIS Actions if variant is not available
                    var $BISActions = $(this.selectors.BISActions, $productGridItem);
                    var $availableActions = $(this.selectors.availableActions, $productGridItem);
                    var $OFstock = $(this.selectors.OFstock, $productGridItem);

                    if (variantAvailable) {
                        $BISActions.addClass('hide');
                        $availableActions.removeClass('hide');
                        $OFstock.addClass('hide');
                    } else {
                        var $BISTrigger = $(this.selectors.BISTrigger, $productGridItem);

                        $BISTrigger.attr('data-variant-id', variantId);
                        $BISActions.removeClass('hide');
                        $availableActions.addClass('hide');
                        $OFstock.removeClass('hide');
                    }
                } else {
                    // Normal operation, disable Add to Cart button
                    if (!variantAvailable) {
                        $addToCartText.text(theme.strings.soldOut)
                        $addToCart.attr('aria-disabled', true);
                    }
                }
            },
            _updateItemPrice: function ($swatch, $productGridItem) {

                var variantPrice = $swatch.data('variant-price'),
                    variantCompareAtPrice = $swatch.data('variant-compare-at-price');

                // Set up Price and Sale badge update
                var $price = $productGridItem.find(this.selectors.price),
                    $saleBadge = $productGridItem.find(this.selectors.saleBadge),
                    $salePercentage = $productGridItem.find(this.selectors.salePercentage);

                // Reset Sale badge
                $saleBadge.addClass('hide');

                // Update price
                // $price.html('<span class="price-price-sale__price" style="' + colorPrice2 + '" data-regular-price=""> ' + theme.Currency.formatMoney(variantPrice, theme.moneyFormat) + '</span>&nbsp;&nbsp;<span class="price-sale__compare" style="' + colorPrice + '" data-regular-price="">' + theme.Currency.formatMoney(variantCompareAtPrice, theme.moneyFormat) + '</span>');


                // Update and show Sale badge
                if (variantCompareAtPrice > variantPrice) {
                    var salePercentage = (variantCompareAtPrice - variantPrice) * 100 / variantCompareAtPrice;
                    $salePercentage.text(String(Math.round(salePercentage)));
                    $saleBadge.removeClass('hide');

                    $price.html('<span class="price-price-sale__price" style="color: #ff4500;  " data-regular-price=""> ' + theme.Currency2.formatMoney(variantPrice, theme.moneyFormat) + '</span>&nbsp;&nbsp;<span class="price-sale__compare" style="color: #252323" data-regular-price="">' + theme.Currency2.formatMoney(variantCompareAtPrice, theme.moneyFormat) + '</span>');
                } else {


                    $price.html('<span class="price-price-sale__price" style="color: #252323; " data-regular-price=""> ' + theme.Currency2.formatMoney(variantPrice, theme.moneyFormat) + '</span>');
                }
            },
            _initTippy: function () {
                var tippyAll;
                if (typeof (tippy) !== 'undefined' && $('.js-tippy').length > 0) {
                    tippyAll = tippy.delegate('[data-product-listing]', {
                        target: '.js-tippy',
                        theme: 'light',
                        trigger: 'mouseenter',
                        placement: 'bottom'
                    });
                }

            },
            _initTippyVariantSwatcher: function (){
                const nameVariant = document.querySelector('.variation-name-desktop span');
                const swatcherWrapper = document.querySelector('.product-section__variant-thumbnails-scroll-container');
                if(swatcherWrapper) {
                    swatcherWrapper.addEventListener('click', (e) => {
                        const isSwatch = e.target.closest('.product-section__variant-thumbnail.js-tippy');
                        if(isSwatch) {
                            const newName = isSwatch.getAttribute('data-tippy-content');
                            nameVariant.innerText = newName;
                        }
                    })
                }
            },
            _initTippyMobVariantSwatcher: function (){
                const nameVariant = document.querySelector('.variation-name span');
                const swatcherWrapper = document.querySelector('.product-section__variant-thumbnails-scroll-container');
                if(swatcherWrapper) {
                    swatcherWrapper.addEventListener('click', (e) => {
                        const isSwatch = e.target.closest('.product-section__variant-thumbnail.js-tippy');
                        if(isSwatch) {
                            const newName = isSwatch.getAttribute('data-tippy-content');
                            nameVariant.innerText = newName;
                        }
                    })
                }
            },
            _initTippyMob: function () {
                var tippyAll;
                if (typeof (tippy) !== 'undefined' && $('.js-tippy').length > 0) {
                    tippyAll = tippy.delegate('[data-product-listing]', {
                        target: '.active',
                        theme: 'light',
                        hideOnClick: true,
                        trigger: 'click',
                        placement: 'bottom',
                        onShow(instance) {
                            var inst = instance;
                            setTimeout(() => {
                                const tippyText = document.querySelectorAll('[data-tippy-root]');
                                if(tippyText.length > 0) {
                                    tippyText.forEach((item) => {
                                        inst.popperInstance.update();
                                        item.style.display = 'block';
                                    })
                                }
                            }, 0)
                        },
                    });

                    $(window).on('scroll', function (){
                        $('[data-tippy-root]').css('display', 'none');
                    })
                }
            },
            _preloadVariantImages: function ($productGridItem) {
                var $swatches = $(this.selectors.swatches, $productGridItem);

                var self = this;

                $swatches.each(function (index, $element) {
                    var $swatch = $($element);

                    if ($swatch.data('variant-image-preloaded') === false) {
                        var $wrapper = $swatch.closest(self.selectors.productGridItem).find(self.selectors.imageWrapper);

                        var $firstImage = $('img', $wrapper).first();

                        if (!$firstImage.hasClass('lazyloaded') ||
                            $firstImage[0].complete === false) {
                            return;
                        }

                        var currentSize = parseInt($firstImage.attr('sizes'));
                        var currentWidths = $firstImage.data('widths');
                        var widthCandidate = getClosestHigherNumber(currentSize, currentWidths);
                        var aspectRatio = parseFloat($firstImage.attr('data-aspectratio'));
                        var height = Math.ceil(widthCandidate / aspectRatio);

                        var urlTemplate = $swatch.data('variant-main-image');

                        var url = urlTemplate.replace('{width}', widthCandidate).replace('{height}', height);

                        var preloadImage = new Image();
                        preloadImage.src = url;
                        preloadImage.onload = function () {
                            preloadImage = null
                        };

                        $swatch.data('variant-image-preloaded', true);
                    }
                });
            },
            _trackAddToCart: function (item) {
                if (!window.snaptr) {
                    return;
                }

                if (!item.id) {
                    return;
                }

                var tracking_id = item.id;

                snaptr('track', 'ADD_CART',
                    {
                        'item_ids': [tracking_id],
                        'price': item.price / 100,
                        'currency': theme.cartCurrency || '',
                    }
                );

            }
        });

        return ProductListing;
    })();

    /* =========== SECTIONS =========== */
    theme.Popup = (function () {
        function Popup(container) {
            var $container = (this.$container = $(container));

            this.popupCookieName = 'wmp-simple-popup';

            this.options = {
                delay: $container.data('delay'),
                frequency: $container.data('frequency'),
                md5: $container.data('md5'),
            }

            this.selectors = {
                popup: '.popup',
                popupLink: '[data-popup-link]',
            }

            if (this._shouldShowPopup()) {
                window.setTimeout(this._openPopup.bind(this), this.options.delay);
                this._setUpPopupLinkClick();
            }
        }

        Popup.prototype = _.assignIn({}, Popup.prototype, {
            _openPopup: function () {
                var $popup = this.$container;

                var setCookie = this._setCookie.bind(this);

                // Do not use cached selector as this value updates in the DOM
                if ($('#shopify-section-popup [data-section-id="popup"]').data('show-popup') === false) {
                    $.magnificPopup.close();
                    return;
                }

                $.magnificPopup.open({
                    items: [
                        {
                            src: $popup,
                            type: 'inline'
                        }
                    ],
                    removalDelay: 300,
                    mainClass: 'mfp-fade',
                    callbacks: {
                        close: function () {
                            if (!Shopify.designMode) {
                                setCookie();
                            }
                        }
                    }
                });
            },
            _shouldShowPopup: function () {
                if (Shopify.designMode) {
                    return false;
                }

                if (navigator.webdriver) {
                    /* Prevent popup in theme preview screenshot */
                    return false;
                }

                // if ($.cookie(this.popupCookieName)) {
                //     if ($.cookie(this.popupCookieName) === this.options.md5) {
                //         return false;
                //     }
                // }

                return true;
            },
            _setCookie: function () {
                $.cookie(this.popupCookieName, this.options.md5, {expires: this.options.frequency, path: '/'});
            },
            _setUpPopupLinkClick: function () {
                if ($(this.selectors.popupLink).length === 0) {
                    return;
                }

                var $popupLink = $(this.selectors.popupLink);
                var popupLinkURL = $popupLink.attr('href');
                var popupLinkTarget = $popupLink.attr('target') || '_self';

                var setCookie = this._setCookie.bind(this);

                $popupLink.on('click', function (e) {
                    e.preventDefault();
                    setCookie();
                    window.open(popupLinkURL, popupLinkTarget);
                });
            },
            onSelect: function (e) {
                this._openPopup();
            },
            onDeselect: function () {
                $.magnificPopup.close();
            },
            onLoad: function () {
                this._openPopup();
            }
        });

        return Popup;
    })();

    theme.DesktopHeader = (function () {
        function DesktopHeader(container) {
            var $container = (this.$container = $(container));

            this._initSearch();
        }

        DesktopHeader.prototype = _.assignIn({}, DesktopHeader.prototype, {
            _initSearch: function () {
                theme.Search.init(this.$container);
            }
        });

        return DesktopHeader;
    })();

    theme.DesktopNav = (function () {
        function DesktopNav(container) {
            var $container = (this.$container = $(container));

            this.selectors = {
                desktopHeaderWrapper: '.desktop-header__top-row-wrapper',
                desktopHeader: '.desktop-header__top-row',
                navWrapper: '.desktop-header__bottom-row-wrapper',
                submenuParents: '.has-submenu',
                megamenuParents: '.has-megamenu',
                siteNavLinks: '.site-nav-link',
                searchToggle: '[data-search-toggle]',
            };

            this.settings = {
                preventNavigationOnSubmenuParents: true,
                stickyNav: $container.data('sticky-nav'),
            }

            if (this.settings.stickyNav) {
                this._initStickyNav();
            }

            if (this.settings.preventNavigationOnSubmenuParents) {
                this._initSubmenuParents();
            }

            this._initSearchToggle();
        }

        DesktopNav.prototype = _.assignIn({}, DesktopNav.prototype, {
            _initStickyNav: function () {
                var options = {
                    root: null,
                    rootMargin: '0px',
                    threshold: [0, 0.01, 1.0]
                }

                var navWrapperEl = document.querySelector(this.selectors.navWrapper);

                function intersectionHandler(entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.intersectionRatio > 0) {
                            // element is in the view
                            navWrapperEl.classList.remove('is-stuck');
                            document.body.classList.remove('has-stuck-nav--desktop');
                        } else {
                            // element is out of view
                            navWrapperEl.classList.add('is-stuck');
                            document.body.classList.add('has-stuck-nav--desktop');
                        }
                    });
                }

                var observer = new IntersectionObserver(intersectionHandler, options);
                var target = document.querySelector(this.selectors.desktopHeaderWrapper);

                observer.observe(target);
            },

            _initSubmenuParents: function () {

                var $submenuParents = this.$container.find(this.selectors.submenuParents + ':not(' + this.selectors.megamenuParents + ')'),
                    $submenuParentLinks = $(this.selectors.siteNavLinks, $submenuParents);

                $submenuParentLinks.on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    $(e.target).blur();
                });

            },

            _initSearchToggle: function () {
                var $searchToggle = $(this.selectors.searchToggle, this.$container),
                    $desktopHeader = $(this.selectors.desktopHeader);

                $searchToggle.on('click', function (e) {
                    e.preventDefault();
                    theme.Search.toggleSearch($desktopHeader);
                });
            }
        });

        return DesktopNav;
    })();

    theme.MobileHeaderAndNav = (function () {
        function MobileHeaderAndNav(container) {
            var $container = (this.$container = $(container));

            this.selectors = {
                menuToggle: '[data-mobile-menu-toggle]',
                mobileMenuContainer: '.mobile-menu-container',
                menuMoreToggle: '[data-menu-more-toggle]',
                submenuParents: '.has-submenu',
                shopSubmenuParent: '[data-has-shop-submenu]',
                menuSubmenu: '[data-menu-submenu]',
                mobileShopSubmenu: '[data-mobile-shop-submenu]',
                mobileShopSubmenu: '[data-mobile-shop-submenu]',
                mobileNavTopLevelLinks: '.mobile-nav-link:not(.mobile-nav-link--submenu)',
                featuredLinks: '[data-featured-links]',
                featuredLink: '[data-featured-link]',
                featuredLinkUrl: '[data-featured-link-url]',
                featuredLinkImage: '[data-featured-link-image]',
                featuredLinkTitle: '[data-featured-link-title]',
            };

            this.settings = {
                preventNavigationOnSubmenuParents: true,
            }

            this._initMenuToggle();
            this._initMenuMoreToggle();
            this._initMobileShopSubmenu();
            this._initSearch();

            if (this.settings.preventNavigationOnSubmenuParents) {
                this._initSubmenuParents();
            }
        }

        MobileHeaderAndNav.prototype = _.assignIn({}, MobileHeaderAndNav.prototype, {
            _initMenuToggle: function () {
                var $menuToggle = $(this.selectors.menuToggle, this.$container);
                var $mobileMenuContainer = $(this.selectors.mobileMenuContainer, this.$container);

                $menuToggle.on('click', function (e) {
                    e.preventDefault();
                    $mobileMenuContainer.toggleClass('is-shown');
                    if ($mobileMenuContainer.hasClass('is-shown')) {
                        $('body').addClass('no-scroll');
                    } else {
                        $('body').removeClass('no-scroll');
                    }
                });
            },

            _initMenuMoreToggle: function () {
                var $menuMoreToggle = $(this.selectors.menuMoreToggle, this.$container);
                var self = this;

                $menuMoreToggle.on('click', function (e) {
                    e.preventDefault();
                    var $menuSubmenu = $(this).closest('.has-submenu').find(self.selectors.menuSubmenu);

                    $menuSubmenu.toggleClass('is-shown');
                });
            },

            _initSubmenuParents: function () {
                var $submenuParents = this.$container.find(this.selectors.submenuParents),
                    $submenuParentLinks = $(this.selectors.mobileNavTopLevelLinks, $submenuParents),
                    self = this;

                $submenuParentLinks.on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var $link = $(e.target);

                    $link.blur();

                    if ($link.closest(self.selectors.submenuParents).find(self.selectors.menuMoreToggle).length > 0) {
                        $link.closest(self.selectors.submenuParents).find(self.selectors.menuMoreToggle).click();
                    }
                });
            },

            _initMobileShopSubmenu: function () {
                if ($(this.selectors.featuredLinks).length = 0 ||
                    typeof window.Vue === 'undefined') {
                    return;
                }

                var shopLinks = [];

                $(this.selectors.featuredLink, this.selectorsFeaturedLinks).each(function () {
                    var shopLink = {
                        title: $(this).data('featured-link-title') || '',
                        image: {
                            src: $(this).data('featured-link-image-src') || '',
                            srcset: $(this).data('featured-link-image-srcset') || '',
                        },
                        url: $(this).data('featured-link-url') || '',
                    };

                    shopLinks.push(shopLink);
                });
                document.addEventListener('wmp:scripts:vueLazy:loaded', function () {
                    var shopLinksComponent = new Vue({
                        el: '#mobile_shop_submenu',
                        delimiters: ["<%", "%>"],
                        data: {
                            shopLinks: shopLinks
                        }
                    });
                })
            },
            _initSearch: function () {
                theme.Search.init(this.$container);
            }
        });

        return MobileHeaderAndNav;
    })();

    theme.SearchPage = (function () {
        function SearchPage(container) {
            this.$container = $(container);

            this.selectors = {
                productListing: '[data-product-listing]',
            };

            this._initProductListing();
        }

        SearchPage.prototype = _.assignIn({}, SearchPage.prototype, {
            _initProductListing: function () {
                this.$productListing = $(this.selectors.productListing, this.$container);
                this.productListing = new theme.ProductListing(this.$productListing);
            },
            onUnload: function () {

            }
        });

        return SearchPage;
    })();


    theme.ShopByCollection = (function () {
        function ShopByCollection(container) {
            this.$container = $(container);

            this.selectors = {
                collectionContainer: '[data-collection-container]',
                collectionItem: '[data-related-products]',
                slickButton: '[data-slick-ctrl-button]'
            };

            this.dataAttributes = {
                collectionHandle: 'related-products',
                slickCtrlButton: 'slick-ctrl-button',
            };

            this.$collectionItems = $(this.selectors.collectionItem, this.$container);

            this._init();
        }

        ShopByCollection.prototype = _.assignIn({}, ShopByCollection.prototype, {
            _init: function () {
                var self = this;
                this.$collectionItems.each(function () {
                    var $collectionItem = $(this);
                    var collectionHandle = $collectionItem.data(self.dataAttributes.collectionHandle);

                    $.get({
                        url: '/collections/' + collectionHandle + '?view=async-related',
                    })
                        .done(function (data) {
                            var $content = $(data);
                            $collectionItem.empty();
                            $collectionItem.append($content);

                            var options = {
                                arrows: false,
                                dots: false,
                                slidesToShow: 3,
                                responsive: [
                                    {
                                        breakpoint: 900,
                                        settings: {
                                            infinite: false,
                                            arrows: true,
                                            slidesToShow: 2
                                        }
                                    },
                                ],
                            };

                            $collectionItem.slick(options);

                            $('body').on('click', self.selectors.slickButton, function (e) {
                                var listingSlick = $(this)
                                    .closest(self.selectors.collectionContainer)
                                    .find('.slick-initialized');

                                listingSlick.slick($(this).data(self.dataAttributes.slickCtrlButton));
                            });

                            self.relatedProductsProductListing = new theme.ProductListing($collectionItem);
                        })
                        .fail(function () {
                            $collectionItem.hide();
                            console.warn('Could not load collection');
                        });
                });
            },
            onUnload: function () {

            }
        });

        return ShopByCollection;
    })();

    theme.Collection = (function () {
        function Collection(container) {
            this.$container = $(container);

            this.sectionId = this.$container.data('section-id');

            this.selectors = {
                productListing: '[data-product-listing]',
                productGridItemPlaceholders: '[data-product-grid-item-placeholder]',
                productGridItems: '[data-product-grid-item]',
                showMoreButton: '[data-show-more-button]',
                showMoreText: '[data-show-more-text]',
                showMoreStatus: '[data-show-more-status]',
                lastPageNotice: '[data-last-page-notice]',
                filters: '#collection-filters-' + this.sectionId,
                mobileFilterToggles: '[data-filter-toggle]',
                tagCount: 0,
                tags: [],
                selected_urls: []
            };

            this.XHRTemplateSuffix = this.$container.data('xhr-template') || 'xhr';

            if ($(this.selectors.filters).length > 0) {
                this._initFilters();
            }

            this._initProductListing();

            if (this.$container.data('infinite-scroll') === true) {
                this._initInfiniteScroll();
            }
        }

        Collection.prototype = _.assignIn({}, Collection.prototype, {
            _getTagsForView: function (url) {
                if (typeof url === 'undefined') {
                    return;
                }

                var tagsUrl = new Url(url);

                tagsUrl.query.view = 'data-filter-tags';

                return fetch(tagsUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        return data
                    })
            },
            _parseFilterTags: function (rawTagsData, groupOrderArray) {
                var tagsData = {},
                    processedTags = {},
                    currentTags = {};

                var filtersToExclude = window.filtersToExclude.split(',');

                for (var i = 0; i < rawTagsData.all_tags.length; i++) {
                    var advancedTag = rawTagsData.all_tags[i];

                    if (filtersToExclude.indexOf(advancedTag.name) !== -1) {
                        continue;
                    }

                    if (advancedTag.name.substr(0, 2) == '__') {
                        continue
                    }

                    var tagParts = advancedTag.name.split('_');
                    var group = tagParts[0];
                    var tagIsActive = false;

                    processedTags[group] = processedTags[group] || [];

                    if (rawTagsData.current_tags &&
                        rawTagsData.current_tags.map(function (value) {
                            return value.name
                        }).indexOf(advancedTag.name) !== -1) {
                        tagIsActive = true;
                    }

                    var processedTag = {
                        group: group,
                        fullTagName: advancedTag.name,
                        displayTagName: tagParts[1],
                        handle: advancedTag.handle,
                        active: tagIsActive,
                    };

                    processedTags[group].push(processedTag);

                    if (tagIsActive) {
                        currentTags[group] = currentTags[group] || [];
                        currentTags[group].push(processedTag);
                    }
                    
                } 

                if (groupOrderArray && groupOrderArray.length > 0) {
                    var sortedProcessedTags = {};

                    for (var i = 0; i < groupOrderArray.length; i++) {
                        var groupName = groupOrderArray[i];

                        if (processedTags.hasOwnProperty(groupName)) {
                            sortedProcessedTags[groupName] = processedTags[groupName];
                        }
                    }

                    processedTags = sortedProcessedTags;
                }

                tagsData.all_tags = processedTags;
                tagsData.current_tags = currentTags;

                return tagsData;
            },
            _initFilters: function () {
                var self = this;

                if(!theme.state.vueLoaded) {
                    window.loadVue();
                }
                document.addEventListener('wmp:scripts:vueLazy:loaded', function () {
                    window.filtersVm = new Vue({
                        el: self.selectors.filters,
                        delimiters: ['<%', '%>'],
                        data: {
                            allTags: {},
                            currentTags: {},
                            selectedGroup: '',
                            materialImages: window.materialImages || {},
                            filtersListContainerStyle: '',
                            proposedTags: {},
                            pushToHistory: true,
                            shown: false,
                            initializing: true,
                        },
                        watch: {
                            selectedGroup: function (value) {
                                // #todo: refactor for new design –
                                // we don’t need this if we’re not
                                // animating the height transition
                                var newHeight = 0;

                                if (value !== '') {
                                    var selectedGroupIndex = this.groups.indexOf(value);
                                    var groupListContainerHeight = this.$refs.groupListContainers[selectedGroupIndex].clientHeight;

                                    newHeight = groupListContainerHeight + 'px';
                                }

                                this.filtersListContainerStyle = 'height: ' + newHeight;
                            },
                            currentTags: function () {
                                this.manageHistoryState();
                            },
                            needsRefresh: function (value) {
                                if (value === true) {
                                    this.shown = true;
                                }
                            },
                            shown: function (value) {
                                var shownClass = 'collection-filters-shown',
                                    noScrollClass = 'no-scroll';
                                var breakpoint = 900;

                                if (value === true) {
                                    if (document.documentElement.clientWidth <= breakpoint) {
                                        document.body.classList.add(noScrollClass);
                                        if(!document.querySelector('.collection-filters__modal-ui').classList.contains('shown')) {
                                        document.querySelector('.collection-filters__modal-ui').classList.add('shown');
                                    }

                                    }

                                    document.body.classList.add(shownClass);
                                } else {
                                    document.body.classList.remove(noScrollClass);
                                    document.body.classList.remove(shownClass);
                                }
                            }
                        },
                        computed: {
                            /**
                             * Compute some flattened representations
                             * of tags so they can be compared
                             * and output more easily.
                             *
                             * Tag handles should be unique on Shopify,
                             * which allows comparison.
                             */
                            currentTagHandles: function () {
                                if (!this.currentTags) {
                                    return [];
                                }

                                var currentTagHandles = [];

                                for (let group in this.currentTags) {
                                    for (let tagIndex in this.currentTags[group]) {
                                        var tag = this.currentTags[group][tagIndex];
                                        currentTagHandles.push(tag.handle);
                                    }
                                }

                                return currentTagHandles;
                            },
                            currentTagsFlat: function () {
                                if (!this.currentTags) {
                                    return [];
                                }

                                var currentTagsFlat = [];

                                for (let group in this.currentTags) {
                                    for (let tagIndex in this.currentTags[group]) {
                                        var tag = this.currentTags[group][tagIndex];
                                        currentTagsFlat.push(tag);
                                    }
                                }

                                return currentTagsFlat;
                            },
                            proposedTagHandles: function () {
                                if (!this.proposedTags) {
                                    return [];
                                }
                                var proposedTagHandlesArr = [];

                                for (let group in this.proposedTags) {
                                    for (let tagIndex in this.proposedTags[group]) {
                                        var tag = this.proposedTags[group][tagIndex];
                                        proposedTagHandlesArr.push(tag.handle);
                                    }
                                }
                                return proposedTagHandlesArr;
                            },
                            proposedTagsFlat: function () {
                                if (!this.proposedTags) {
                                    return [];
                                }

                                var proposedTagsFlat = [];

                                for (let group in this.proposedTags) {
                                    for (let tagIndex in this.proposedTags[group]) {
                                        var tag = this.proposedTags[group][tagIndex];
                                        proposedTagsFlat.push(tag);
                                    }
                                }

                                return proposedTagsFlat;
                            },
                            /**
                             * End flattened tags.
                             */
                            needsRefresh: function () {
                                if (!this.currentTagHandles || !this.proposedTagHandles) {
                                    return false;
                                }

                                return !(_.isEqual(
                                    this.currentTagHandles.sort(),
                                    this.proposedTagHandles.sort()
                                ));
                            },
                            groups: function () {
                                return Object.keys(this.allTags);
                            },
                            activeGroups: function () {
                                if (!this.currentTags) {
                                    return [];
                                }

                                var activeGroups = [];

                                for (let group in this.currentTags) {
                                    activeGroups.push(group);
                                }

                                return activeGroups;
                            }
                        },
                        methods: {
                            expandMaterialIcon: function (isExpanded) {
                                if (isExpanded) {
                                    return 'expand_less';
                                }

                                return 'expand_more';
                            },
                            tagIsProposed: function (tag) {
                                if (this.proposedTagHandles) {
                                    return (this.proposedTagHandles.indexOf(tag.handle) !== -1);
                                }

                                return false;
                            },
                            selectGroup: function (group) {
                                if (this.selectedGroup === group) {
                                    this.selectedGroup = '';
                                } else {
                                    this.selectedGroup = group;
                                }
                            },
                            selectGroupAndShowOnMobile: function (group) {
                                this.shown = true;

                                var self = this;

                                this.$nextTick(function () {
                                    self.selectedGroup = group;
                                });
                            },
                            groupIsActive: function (group) {
                                return (this.activeGroups.indexOf(group) !== -1);
                            },
                            selectTag: function (tag) {
                                console.log('select tag here')
                                if (this.tagIsProposed(tag)) {
                                    this.removeProposedTag(tag);
                                } else {
                                    this.addProposedTag(tag);
                                }
                            },
                            addProposedTag: function (tag) {
                                console.log(tag)
                                // only one tag from a group can be proposed: tag.group
                                // multi tag from a group can be proposed: tag.fullTagName.
                                this.$set(this.proposedTags, tag.fullTagName, [tag]);
                                // this.processedTags.push(tag)
                            },
                            removeProposedTag: function (tag) {
                                this.$delete(this.proposedTags, tag.fullTagName);
                                // this.processedTags.remove(tag)
                            },
                            submitProposedTags: function () {
                                var currentFilterPath = window.location.href.split(window.collectionBaseUrl)[1].split('?')[0];
                                var newFilterPath = this.proposedTagHandles.join('+');
                                self.selectors.tags = this.proposedTagHandles;
                                var newUrl = window.collectionBaseUrl + '/' + newFilterPath;

                                if($('.collection-filters__filter').hasClass('active')){

                                }else {
                                     window.location = newUrl;
                                }
                               
                                this.refresh(newUrl);
                                this.shown = false;
                            },
                            clearProposedTag: function (tag) {
                                this.removeProposedTag(tag);
                            },
                            clearAllProposedTags: function () {
                                this.proposedTags = {};
                            },
                            clearAllProposedTagsNew: function () {
                                var newUrl = window.collectionBaseUrl + '/' ;
                                window.location = newUrl;
                                this.refresh(newUrl);
                                this.shown = false;
                                

                            },
                            clearCurrentTag: function (tag) {
                                if (this.currentTagHandles.length > 1) {
                                    this.removeProposedTag(tag);
                                } else {
                                    this.clearAllCurrentTags();
                                }
                            },
                            clearAllCurrentTags: function () {
                                this.refresh();
                            },
                            refreshProductListing: function (url) {
                                var xhrTemplateSuffix = 'xhr-filtered';

                                if (url == window.collectionBaseUrl) {
                                    xhrTemplateSuffix = null;
                                }

                                var xhrUrl = self._getXHRTemplateUrl(url, xhrTemplateSuffix);
                                $('.product-listing .grid-item-img').remove();
                                self._getPage(xhrUrl, true);
                            },
                            refreshTags: function (url) {
                                var _vm = this;

                                self._getTagsForView(url)
                                    .then(
                                        function (rawTagsData) {
                                            var tagsData = self._parseFilterTags(
                                                rawTagsData,
                                                window.groupArrayString.split(',')
                                            );
                                                console.log(tagsData, 'tags_Data')
                                                console.log(rawTagsData, "tags")
                                            _vm.allTags = tagsData.all_tags;
                                            _vm.currentTags = tagsData.current_tags;
                                            // initialize proposedTags to currentTags without passing it by reference
                                            _vm.proposedTags = JSON.parse(JSON.stringify(tagsData.current_tags));
                                            _vm.initializing = false;
                                        }
                                    );
                            },
                            refresh: function (url, pushToHistory) {
                                if (!url) {
                                    url = window.collectionBaseUrl;
                                }

                                if (pushToHistory === false) {
                                    this.pushToHistory = false;
                                } else {
                                    this.pushToHistory = true;
                                }

                                this.refreshProductListing(url);

                                this.refreshTags(url);
                                this.selectedGroup = '';
                            },
                            manageHistoryState: function () {
                                var newUrl = window.collectionBaseUrl + '/' + this.currentTagHandles.join('+');
                                var newTitle = this.currentTagsFlat.length ? document.title + ' Filtered by: ' : document.title;

                                for (var i = 0; i < this.currentTagsFlat.length; i++) {
                                    var tag = this.currentTagsFlat[i];
                                    newTitle += tag.group + ' – ' + tag.displayTagName;

                                    if (i < (this.currentTagsFlat.length - 1)) {
                                        newTitle += ', '
                                    }
                                }

                                if (this.pushToHistory) {
                                    history.pushState({url: newUrl}, newTitle, newUrl);
                                } else {
                                    history.replaceState({url: newUrl}, newTitle, newUrl);
                                }
                            },
                            enterHistoryState: function (event) {
                                if (event && event.state && event.state.url) {
                                    this.refresh(event.state.url, false);
                                }
                            }
                        },
                        mounted: function () {
                            this.refreshTags(window.location.href);
                            this.selectedGroup = '';
                        },
                        created: function () {
                            window.onpopstate = this.enterHistoryState;
                        }
                    });

                    $(document.body).on('click', self.selectors.mobileFilterToggles, function (e) {
                        e.preventDefault();
                        if(!document.querySelector('.collection-filters__modal-ui').classList.contains('shown')) {
                            window.filtersVm.shown = true;
                        } else {
                            window.filtersVm.shown = false;
                        }

                    });
                })
            },
            _getXHRTemplateUrl: function (url, suffix) {
                if (typeof url === 'undefined') {
                    return;
                }

                var returnUrl = new Url(url);

                var templateSuffix = suffix || this.XHRTemplateSuffix;

                // Request the XHR template
                if (returnUrl.query.view !== templateSuffix) {
                    returnUrl.query.view = templateSuffix;
                }

                return returnUrl;
            },
            _initProductListing: function () {
                this.$productListing = $(this.selectors.productListing, this.$container);
                this.$productGridItemPlaceholders = $(this.selectors.productGridItemPlaceholders, this.$container);
                if (this.$productListing.data('loaded') === false) {
                    var url = this._getXHRTemplateUrl(window.location.href);

                    var self = this;

                    $.get({
                        url: url
                    })
                        .done(function (data) {
                            var $newProductListingEls = $(data).find(self.selectors.productListing).html();
                            self.$productGridItemPlaceholders.addClass('hide');
                            self.$productListing.append($newProductListingEls);
                            self.$productListing.data('loaded', true);
                            self.productListing = new theme.ProductListing(self.$productListing);
                        });
                } else {
                    this.productListing = new theme.ProductListing(this.$productListing);
                }
            },
            _initInfiniteScroll: function () {
                if (!document.querySelector(this.selectors.showMoreButton)) {
                    return;
                }

                var self = this;

                $(this.selectors.showMoreButton).on('click', function (e) {
                    e.preventDefault();
                    self._getNextPage();
                });

                var options = {
                    root: null,
                    rootMargin: '500px',
                    threshold: [0, 0.01, 1.0]
                }

                function intersectionHandler(entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.intersectionRatio > 0) {
                            // element is in the view
                            if (!self.loadingInfiniteScroll) {
                                self._getNextPage();
                            }
                        }
                    });
                }

                this.infiniteScrollObserver = new IntersectionObserver(intersectionHandler, options);
                var target = document.querySelector(this.selectors.showMoreButton);

                this.infiniteScrollObserver.observe(target);
            },
            _clearStateRenderedProducts: function (idProduct) {
                var variantsIds = Object.keys(theme.state.shownVariants[idProduct]);
                theme.state.shownVariants[idProduct] = null;
                theme.state.shownVariants[idProduct] = {};
                variantsIds.forEach((variantId) => {
                    theme.state.shownVariants[idProduct][variantId] = false;
                });
            },
            _checkSelectedVariants: function () {
                var shownVariants = theme.state.shownVariants;
                var renderedProducts = theme.state.renderedProducts;
                var collectionQty = theme.state.collectionProducts ? theme.state.collectionProducts.length : 0;
                var renderedQty = theme.state.renderedProducts ? theme.state.renderedProducts.length : 0;
                if (renderedQty > collectionQty) {
                    var lastRenderedPageProducts = renderedProducts.slice(renderedQty - 9, renderedQty);
                    lastRenderedPageProducts.each((idx, prod) => {
                        let isWithoutVariants = prod.classList.contains('grid-item-img');
                        if(!isWithoutVariants) {
                            var currentProdId = Number(prod.attributes['data-product-id'].value);
                            var arrValues = Object.values(shownVariants[currentProdId]);
                            var flagAllShowedVariants = arrValues.every(function (value) {
                                if (value === true) return value
                            });
                            if (flagAllShowedVariants) {
                                Collection.prototype._clearStateRenderedProducts(currentProdId);
                                $(prod).find('.swatch.js-tippy.is-selected').each((idx, prodEl) => {
                                    $(prodEl).removeClass('is-selected');
                                })
                                var variantsLength = $(prod).find('.swatch.js-tippy').length;
                                $(prod).find('.swatch.js-tippy').eq(Math.floor(Math.random() * variantsLength)).addClass('is-selected');
                            }

                            var currentSelectedVariantId = Number($(prod).find('.swatch.js-tippy.is-selected').attr('data-variant-id'));
                            if (shownVariants[currentProdId][currentSelectedVariantId]) {
                                for (var _i = 0, _Object$entries = Object.entries(shownVariants[currentProdId]); _i < _Object$entries.length; _i++) {
                                    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                                        key = _Object$entries$_i[0],
                                        value = _Object$entries$_i[1];

                                    if (!value) {
                                        $(prod).find('.swatch.js-tippy.is-selected').removeClass('is-selected');
                                        $(prod).find(".swatch.js-tippy[data-variant-id=\"".concat(key, "\"]")).trigger('click');
                                    }
                                }
                            }
                        }

                    })
                }
                theme.state.renderedProducts.each((idx, prod) => {
                    let isWithoutVariants = prod.classList.contains('grid-item-img');
                    if(!isWithoutVariants && prod.attributes.hasOwnProperty('data-product-id')) {
                    var prodId = Number(prod.attributes['data-product-id'].value);
                    var selectedVariantId = Number($(prod).find('.swatch.js-tippy.is-selected').attr('data-variant-id'));
                    theme.state.shownVariants[prodId][selectedVariantId] = true;
                    }

                });
            },
            _getProduct: function (tagCount) {
                var newUrl = window.collectionBaseUrl + '/' + this.selectors.selected_urls[tagCount];
                var xhrTemplateSuffix = 'xhr-filtered';
                var xhrUrl = this._getXHRTemplateUrl(newUrl, xhrTemplateSuffix);
                var self = this;
                $.ajax({
                    url: xhrUrl,
                    
                    success: function (data, textStatus, jqXHR) {
                        var newProductListingEls = $(data).find(self.selectors.productListing).html();
                        var returnUrl = new Url($(data).find(self.selectors.showMoreButton).attr('href'));
                        if (returnUrl.query.page == 1) {
                            globalCount++;
                            var elems = $(data).find(self.selectors.productListing + ' .product-grid-item');
                            elems.each(function () {
                                $(this).addClass(globalCount);
                            })
                        }
                        $(self.selectors.productListing, this.$container).append(newProductListingEls);
                        
                        var newNextPageUrl = self._getXHRTemplateUrl($(data).find(self.selectors.showMoreButton).attr('href'));
                        if (typeof newNextPageUrl !== 'undefined') {
                            $(self.selectors.showMoreButton, this.$container).attr('href', newNextPageUrl);
                            theme.state.renderedProducts = $('.product-listing .product-grid-item');
                            theme.collectionTemplate === 'infinity-scroll' && self._checkSelectedVariants();
                        } else {
                            // Do not disconnect as it may be needed for
                            // filtered views
                            // self.infiniteScrollObserver.disconnect();
                            $(self.selectors.showMoreButton).addClass('hide');
                            $(self.selectors.lastPageNotice).removeClass('hide');
                            theme.state.renderedProducts = $('.product-listing .product-grid-item');
                            theme.collectionTemplate === 'infinity-scroll' && self._checkSelectedVariants();
                        }
                        if ($(window).width() > 768) {
                            $('.product-listing .product-grid-item.grid-item-img.descto-grid-img').each((idx, item) => {
                                if(idx === 0) {
                                    $(item).addClass('active');
                                }
                            })
                        }else {
                            $('.product-listing .product-grid-item.grid-item-img.mob-grid-img').each((idx, item) => {
                                if(idx === 0) {
                                    $(item).addClass('active');
                                }
                            })
                        }
                    },
                    error: function (error) {
                        console.warn(error)
                    },
                    complete: function (data) {
                        if (tagCount == tagTotalCount - 1) {
                            self.productListing.initTS();
                            self.$productGridItemPlaceholders.addClass('hide');
                            $(self.selectors.showMoreText, self.$container).removeClass('hide');
                            $(self.selectors.showMoreStatus, self.$container).addClass('hide');
                            $(self.selectors.showMoreButton, self.$container).css('min-width', '');
                            self.loadingInfiniteScroll = false;
                            self._checkCompletion(data);
                            self.selectors.selected_urls = [];
                        } else if (tagCount < tagTotalCount-1) {
                            self._getProduct(tagCount+1);
                        }
                    }
                });
            },
            _getPage: function (url, replace) {
                if (typeof this.productListing === 'undefined') {
                    return;
                }

                var self = this;

                $(this.selectors.showMoreButton, this.$container)
                    .css(
                        'min-width',
                        $(this.selectors.showMoreButton, this.$container)
                            .outerWidth()
                    );
                $(this.selectors.showMoreText, this.$container).addClass('hide');
                $(this.selectors.showMoreStatus, this.$container).removeClass('hide');
          
                if (url.path.indexOf('%20') > -1) {
                    var frame_color_arr = ['empty'];
                    var lens_color_arr = ['empty'];
                    var frame_material_arr = ['empty'];
                    var frame_style_arr = ['empty'];
                    var lens_type_arr = ['empty'];
                    var head_arr = ['empty'];
                    var selected_group_arr = ['empty'];
                    for (let index = 0; index <  this.selectors.tags.length; index++) {
                        var tag = this.selectors.tags[index];
                        if (tag.indexOf('frame-color') != -1) {
                            frame_color_arr.push(tag);
                            if (selected_group_arr.indexOf('frame-color') == -1) {
                                selected_group_arr.push('frame-color');
                            }
                        } else if (tag.indexOf('lens-color') != -1) {
                            lens_color_arr.push(tag);
                            if (selected_group_arr.indexOf('lens-color') == -1) {
                                selected_group_arr.push('lens-color');
                            }
                        } else if (tag.indexOf('frame-material') != -1) {
                            frame_material_arr.push(tag);
                            if (selected_group_arr.indexOf('frame-material') == -1) {
                                selected_group_arr.push('frame-material');
                            }
                        } else if (tag.indexOf('frame-style') != -1) {
                            frame_style_arr.push(tag);
                            if (selected_group_arr.indexOf('frame-style') == -1) {
                                selected_group_arr.push('frame-style');
                            }
                        } else if (tag.indexOf('lens-type') != -1) {
                            lens_type_arr.push(tag);
                            if (selected_group_arr.indexOf('lens-type') == -1) {
                                selected_group_arr.push('lens-type');
                            }
                        } else if (tag.indexOf('head') != -1) {
                            head_arr.push(tag);
                            if (selected_group_arr.indexOf('head') == -1) {
                                selected_group_arr.push('head');
                            }
                        } 
                    }
                    // var new_urls = [];
                    var new_url = '';
                    for (let index = 0; index < frame_color_arr.length; index++) {
                        const frame_color = frame_color_arr[index];
                        for (let index = 0; index < lens_color_arr.length; index++) {
                            const lens_color = lens_color_arr[index];
                            for (let index = 0; index < frame_material_arr.length; index++) {
                                const frame_material = frame_material_arr[index];
                                for (let index = 0; index < frame_style_arr.length; index++) {
                                    const frame_style = frame_style_arr[index];
                                    for (let index = 0; index < lens_type_arr.length; index++) {
                                        const lens_type = lens_type_arr[index];
                                        for (let index = 0; index < head_arr.length; index++) {
                                            const head = head_arr[index];
                                            new_url += '+' + frame_color+ '+'+ lens_color + '+'+frame_material+'+'+frame_style+ '+' + lens_type+ '+'+head;
                                            new_url = new_url.replaceAll('+empty', '')
                                            var new_urls = new_url.split('+');
                                            if (selected_group_arr.length == new_urls.length) {
                                                self.selectors.selected_urls.push(new_url.replace('+',''))
                                            }
                                            new_url = '';
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tagTotalCount = this.selectors.selected_urls.length;
                    
                    if (replace === true) {
                        $(self.selectors.productGridItems, this.$container).remove();
                        self.$productGridItemPlaceholders.removeClass('hide');
                    }

                    self.loadingInfiniteScroll = true;
                    
                    this._getProduct(0);
                } else {
                    $.ajax({
                        url: url,
                        beforeSend: function () {
                            if (replace === true) {
                                $(self.selectors.productGridItems, this.$container).remove();
                                self.$productGridItemPlaceholders.removeClass('hide');
                            }
    
                            self.loadingInfiniteScroll = true;
                        },
                        success: function (data, textStatus, jqXHR) {
                            var newProductListingEls = $(data).find(self.selectors.productListing).html();
                            var returnUrl = new Url($(data).find(self.selectors.showMoreButton).attr('href'));
                            if (returnUrl.query.page == 1) {
                                globalCount++;
                                var elems = $(data).find(self.selectors.productListing + ' .product-grid-item');
                                elems.each(function () {
                                    $(this).addClass(globalCount);
                                })
                            }
                            $(self.selectors.productListing, this.$container).append(newProductListingEls);
                            self.productListing.initTS();
                            var newNextPageUrl = self._getXHRTemplateUrl($(data).find(self.selectors.showMoreButton).attr('href'));
                            if (typeof newNextPageUrl !== 'undefined') {
                                $(self.selectors.showMoreButton, this.$container).attr('href', newNextPageUrl);
                                theme.state.renderedProducts = $('.product-listing .product-grid-item');
                                theme.collectionTemplate === 'infinity-scroll' && self._checkSelectedVariants();
                            } else {
                                // Do not disconnect as it may be needed for
                                // filtered views
                                // self.infiniteScrollObserver.disconnect();
                                $(self.selectors.showMoreButton).addClass('hide');
                                $(self.selectors.lastPageNotice).removeClass('hide');
                                theme.state.renderedProducts = $('.product-listing .product-grid-item');
                                theme.collectionTemplate === 'infinity-scroll' && self._checkSelectedVariants();
                            }
                            if ($(window).width() > 768) {
                                $('.product-listing .product-grid-item.grid-item-img.descto-grid-img').each((idx, item) => {
                                    if(idx === 0) {
                                        $(item).addClass('active');
                                    }
                                })
                            }else {
                                $('.product-listing .product-grid-item.grid-item-img.mob-grid-img').each((idx, item) => {
                                    if(idx === 0) {
                                        $(item).addClass('active');
                                    }
                                })
                            }
                        },
                        error: function (error) {
                            console.warn(error)
                        },
                        complete: function (data) {
                            self.$productGridItemPlaceholders.addClass('hide');
                            $(self.selectors.showMoreText, self.$container).removeClass('hide');
                            $(self.selectors.showMoreStatus, self.$container).addClass('hide');
                            $(self.selectors.showMoreButton, self.$container).css('min-width', '');
                            self.loadingInfiniteScroll = false;
                            self._checkCompletion(data);
                            //self._initProductListing(); 
                        }
                    });
                }
                
            },
            _checkCompletion: function (data) {
                /**
                 * If there are less than 9 product grid items
                 * and a next page URL, get that page.
                 *
                 * (This can happen when filtering, the
                 *  pagination makes for empty pages between
                 *  results.)
                 */

                var productGridItemsLength = $(data.responseText).find(this.selectors.productGridItems).length,
                    nextPageUrl = $(data).find(this.selectors.showMoreButton).attr('href');

                if (typeof nextPageUrl !== 'undefined' && productGridItemsLength < 9) {
                    this._getPage(nextPageUrl.toString(), false);
                }
            },
            _getNextPage: function () {
                if (!document.querySelector(this.selectors.showMoreButton)) {
                    return;
                }

                if ($(this.selectors.showMoreButton).attr('aria-disabled') === 'true') {
                    return;
                }

                var url = this._getXHRTemplateUrl($(this.selectors.showMoreButton).attr('href')),
                    replace = false;

                this._getPage(url, replace);
            },
            onUnload: function () {
                this.infiniteScrollObserver.disconnect();
            }
        });

        return Collection;
    })();

    theme.Product = (function () {
        function Product(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr('data-section-id');

            this.sectionId = sectionId;
            this.namespace = '.product';

            this.selectors = {
                productJson: '[data-product-json]',
                initialMedia: '[data-initial-media]',
                productSlideshow: '[data-product-slideshow]',
                desktopSlideshow: '#product-section-desktop-slideshow-' + sectionId,
                desktopThumbnails: '#product-section-desktop-thumbnails-' + sectionId,
                desktopSeeItStyled: '[data-desktop-see-it-styled]',
                mobileSlideshow: '#product-section-mobile-slideshow-' + sectionId,
                variantThumbnailsContainer: '[data-variant-thumbnails]',
                variantThumbnails: '[data-variant-thumbnail]',
                singleOptionSelector: '.single-option-selector-' + sectionId,
                originalSelectorId: '#ProductSelect-' + sectionId,
                stars: '[data-stars]',
                tabs: '[data-tabs-container]',
                productDescription: '[data-product-description]',
                productDimensions: '[data-product-dimensions]',
                mobileSeeItStyled: '[data-mobile-see-it-styled]',
                mobileSeeItStyledLink: '[data-mobile-see-it-styled-link]',
                productForm: '[data-product-form]',
                availableActions: '[data-available-actions]',
                BISActions: '[data-bis-actions]',
                OFstock: '[data-out-of-stock]',
                BISTrigger: '[data-bis-trigger]',
                addToCart: '[data-add-to-cart]',
                addToCartText: '[data-add-to-cart-text]',
                loader: '[data-loader]',
                shopifyPaymentButton: '.shopify-payment-button',
                price: '[data-price]',
                regularPrice: '[data-regular-price]',
                salePrice: '[data-sale-price]',
                trustspotContainer: '.product-section__trustspot',
                reviewsSection: '#product-reviews-' + this.sectionId,
                expandReviews: '[data-expand-reviews]',
                productVideo: '[data-product-video]',
            };

            this.classes = {
                active: 'is-active',
                priceOnSale: 'price--on-sale',
                hidden: 'hide',
                expanded: 'is-expanded'
            };

            this.attributes = {};

            this.settings = {
                enableBIS: $container.data('enable-bis') || false,
            };

            if (!$('#ProductJson-' + sectionId).html()) {
                return;
            }

            this.productSingleObject = JSON.parse(
                document.getElementById('ProductJson-' + sectionId).innerHTML
            );

            this.$addToCart = $(this.selectors.addToCart, $container);
            this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
            this.$shopifyPaymentButton = $(this.selectors.shopifyPaymentButton, $container);

            this.$loader = $(this.selectors.loader, this.$addToCart);
            this.$loaderStatus = $(this.selectors.loaderStatus, $container);

            this._initVariantThumbs();
            this._initVariants();
            this._initAddToCart();
            this._initProductSlideshows();
            this._initTabs();
            this._initStars();
            this._initExpandReviews();
            this._initTSReviewsWidget();
            this._initDesktopSeeItStyled();
            this._initMobileSeeItStyled();

            this.$productVideos = $(this.selectors.productVideo, $container);
            if (this.$productVideos.length > 0) {
                this._initProductVideo();
            }

            this.$productDescription = $(this.selectors.productDescription, $container);
            this.$productDimensions = $(this.selectors.productDimensions, $container);

            this._initDimensions();

            if (this.settings.enableBIS === true) {
                this._initBIS();
            }

            var currentUrl = new Url(window.location.href);

            if (currentUrl.query['open-to'] === 'reviews') {
                this._scrollToReviews();
            }
        }

        Product.prototype = _.assignIn({}, Product.prototype, {
            _initVariantThumbs: function () {
                var self = this;

                this.$variantThumbs = $(this.selectors.variantThumbnails, this.$container);

                this.$variantThumbs.on('click', function (e) {
                    e.preventDefault();
                    var $variantThumb = $(this),
                        option1 = $(this).data('variant-option1'),
                        option2 = $(this).data('variant-option2'),
                        option3 = $(this).data('variant-option3');
                    $(self.selectors.singleOptionSelector + '[data-index="option1"]').val(option1).trigger('change');
                    $(self.selectors.singleOptionSelector + '[data-index="option2"]').val(option2).trigger('change');
                    $(self.selectors.singleOptionSelector + '[data-index="option3"]').val(option3).trigger('change');
                });

                var tippyVariantThumbs;
                if (typeof (tippy) !== 'undefined' && $('.js-tippy').length > 0) {
                    tippyVariantThumbs = tippy
                        .delegate(self.selectors.variantThumbnailsContainer, {
                            target: '.js-tippy',
                            theme: 'light',
                            trigger: 'mouseenter tap',
                            placement: 'bottom',
                        });
                }
            },
            _syncVariantThumbs: function (e) {
                if (!this.$variantThumbs || this.$variantThumbs.length === 0) {
                    return;
                }

                this.$variantThumbs.removeClass(this.classes.active);
                var $activeVariantThumb = this.$variantThumbs
                    .filter('[data-variant-id="' + e.variant.id + '"]');
                $activeVariantThumb.addClass(this.classes.active);
                $activeVariantThumb[0].scrollIntoView;
            },
            _initVariants: function () {
                var options = {
                    $container: this.$container,
                    enableHistoryState:
                        this.$container.data('enable-history-state') || false,
                    singleOptionSelector: this.selectors.singleOptionSelector,
                    originalSelectorId: this.selectors.originalSelectorId,
                    product: this.productSingleObject
                };

                this.variants = new slate.Variants(options);

                this.$container.on(
                    'variantImageChange' + this.namespace,
                    this._updateMedia.bind(this)
                );

                this.$container.on(
                    'variantPriceChange' + this.namespace,
                    this._updatePrice.bind(this)
                );

                this.$container.on(
                    'variantChange' + this.namespace,
                    this._updateAvailability.bind(this)
                );

                this.$container.on(
                    'variantChange' + this.namespace,
                    this._trackVariantChange.bind(this)
                );

                this.$container.on(
                    'variantChange' + this.namespace,
                    this._syncVariantThumbs.bind(this)
                );
            },
            _initAddToCart: function () {
                $(this.selectors.productForm, this.$container).on(
                    'submit',
                    function (e) {
                        if (this.$addToCart.is('[aria-disabled]')) {
                            e.preventDefault();
                            return;
                        }

                        e.preventDefault();

                        this.$previouslyFocusedElement = $(':focus');

                        this._handleButtonLoadingState(true);
                        var $data = $(this.selectors.productForm, this.$container);
                        this._addItemToCart($data);
                        return;
                    }.bind(this)
                );
            },
            _addItemToCart: function (data) {
                var params = {
                    url: '/cart/add.js',
                    data: $(data).serialize(),
                    dataType: 'json'
                };

                $.post(params)
                    .done(
                        function (item) {
                            document.dispatchEvent(new CustomEvent('wmp:cart:added', {
                                detail: {
                                    item: item
                                }
                            }));
                            this._handleButtonLoadingState(false);
                            this._trackAddToCart(item);
                        }.bind(this)
                    )
                    .fail(
                        function (response) {
                            this.$previouslyFocusedElement.focus();
                            var errorMessage = response.responseJSON
                                ? response.responseJSON.description
                                : theme.strings.cartError;
                            document.dispatchEvent(new CustomEvent('wmp:cart:error', {
                                detail: {
                                    errorMessage: errorMessage
                                }
                            }));
                            this._handleButtonLoadingState(false);
                        }.bind(this)
                    );
            },
            _handleButtonLoadingState: function (isLoading) {
                if (isLoading) {
                    this.$addToCart.attr('aria-disabled', true);
                    this.$addToCartText.addClass(this.classes.hidden);
                    this.$loader.removeClass(this.classes.hidden);
                    this.$shopifyPaymentButton.attr('disabled', true);
                } else {
                    this.$addToCart.removeAttr('aria-disabled');
                    this.$addToCartText.removeClass(this.classes.hidden);
                    this.$loader.addClass(this.classes.hidden);
                    this.$shopifyPaymentButton.removeAttr('disabled');
                }
            },
            _initProductSlideshows: function () {
                this.$desktopSlideshow = $(this.selectors.desktopSlideshow, this.$container);
                this.$desktopThumbnails = $(this.selectors.desktopThumbnails, this.$container);
                this.$mobileSlideshow = $(this.selectors.mobileSlideshow, this.$container);

                var desktopInitialSlide = 0,
                    desktopThumbnailsInitialSlide = 0,
                    mobileInitialSlide = 0;

                if ($(this.selectors.initialMedia, this.$desktopSlideshow).length > 0) {
                    desktopInitialSlide = parseInt($(this.selectors.initialMedia, this.$desktopSlideshow).data('media-index')) || 0;
                }

                if ($(this.selectors.initialMedia, this.$desktopThumbnails).length > 0) {
                    desktopThumbnailsInitialSlide = parseInt($(this.selectors.initialMedia, this.$desktopThumbnails).data('media-index')) || 0;
                }

                if ($(this.selectors.initialMedia, this.$mobileSlideshow).length > 0) {
                    mobileInitialSlide = parseInt($(this.selectors.initialMedia, this.$mobileSlideshow).data('media-index')) || 0;
                }

                var desktopOptions = {
                        // arrows: false,
                        // dots: false,
                        // asNavFor: this.selectors.desktopThumbnails,
                        // initialSlide: desktopInitialSlide,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false,
                        fade: true,

                    },
                    desktopThumbnailOptions = {
                        vertical:true,
                        verticalSwiping:true, 
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        asNavFor: this.selectors.desktopSlideshow,
                    },
                    mobileOptions = {
                        arrows: true,
                        dots: true,
                        initialSlide: mobileInitialSlide,
                    };

                this.desktopSlideshow = new theme.BreakpointSlideshow(this.$desktopSlideshow, desktopOptions);
                this.desktopThumbnailSlideshow = new theme.BreakpointSlideshow(this.$desktopThumbnails, desktopThumbnailOptions);
                this.mobileSlideshow = new theme.BreakpointSlideshow(this.$mobileSlideshow, mobileOptions);

                $('.product-section__desktop-thumbnails').on('click', function (e) {
                    const slickIndex = $(e.target).parents('.slick-slide').attr('data-slick-index');
                    $('.product-section__desktop-slideshow').slick('slickGoTo', slickIndex);
                });
            },
            _initTabs: function () {
                var $tabs = $(this.selectors.tabs, this.$container);
                this.responsiveTabs = new theme.ResponsiveTabs($tabs);
            },
            _initStars: function () {
                var $stars = $(this.selectors.stars, this.$container);
                var self = this;
                $stars.on('click', function (e) {
                    e.preventDefault();
                    self._scrollToReviews();
                })
            },
            _initExpandReviews: function () {
                var self = this;

                $(this.selectors.expandReviews).on('click', function (e) {
                    e.preventDefault();
                    $(this).closest(self.selectors.trustspotContainer)
                        .addClass(self.classes.expanded);
                })
            },
            _initTSReviewsWidget: function () {
                var $ts = $(this.selectors.trustspotContainer, this.$container);

                $ts.on('click', '.write-review-modal', function (e) {
                    var $scrollHost = $('html,body');
                    var scrollTarget = 0;

                    if ($(window).width() > 900) {
                        scrollTarget = $('#trustspot-write-review').offset().top - 120;
                    } else {
                        scrollTarget = $('#trustspot-write-review').offset().top - 120;
                    }

                    $scrollHost.animate({scrollTop: scrollTarget}, 150);
                });

                $ts.on('click', 'a.ask-question-modal', function (e) {
                    var $scrollHost = $('html,body');
                    var scrollTarget = 0;

                    if ($(window).width() > 900) {
                        scrollTarget = $('#trustspot-question-asked').offset().top - 120;
                    } else {
                        scrollTarget = $('#trustspot-question-asked').offset().top - 120;
                    }

                    $scrollHost.animate({scrollTop: scrollTarget}, 150);
                });
            },
            _initDesktopSeeItStyled: function () {
                this.$desktopSeeItStyled = $(this.selectors.desktopSeeItStyled, this.$container);

                var options = {
                    slidesToShow: 3,
                    arrows: true,
                    dots: false
                };

                this.desktopSeeItStyledSlideshow = new theme.BreakpointSlideshow(this.$desktopSeeItStyled, options);
            },
            _initMobileSeeItStyled: function () {
                this.$mobileSeeItStyled = $(this.selectors.mobileSeeItStyled, this.$container);
                var options = {
                    arrows: true,
                    dots: false
                };

                this.mobileSeeItStyledSlideshow = new theme.BreakpointSlideshow(this.$mobileSeeItStyled, options);

                var self = this;

                $(this.selectors.mobileSeeItStyledLink, this.$container)
                    .on('click', function (e) {
                        e.preventDefault();
                        self._scrollToMobileSeeItStyled();
                    });
            },
            _initProductVideo: function () {
                var videoEls = document.querySelectorAll(this.selectors.productVideo);

                var options = {
                    rootMargin: "0px",
                    threshold: [0, 1]
                };

                function handler(entries, observer) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.intersectionRatio >= 0.5) {
                            entry.target.getElementsByTagName('video')[0].play();
                        } else {
                            entry.target.getElementsByTagName('video')[0].pause();
                        }
                    }
                }

                var observer = new IntersectionObserver(handler, options);

                for (var i = 0; i < videoEls.length; i++) {
                    observer.observe(videoEls[i]);
                }


                this.$container.on('click', this.selectors.productVideo, function (e) {
                    var videoEl = $(e.currentTarget).find('video')[0];
                    if (videoEl.paused === true) {
                        videoEl.play();
                    } else {
                        videoEl.pause();
                    }
                });
            },
            _updateMedia: function (e) {
                var variant = e.variant;
                var variantMediaId = variant.featured_media.id;
                // get current, uncached product slideshow
                // could be mobile or desktop
                var $targetSlide = $(this.selectors.productSlideshow + '.slick-initialized')
                    .find('[data-single-media-id="' +
                        this.sectionId + '-' + variantMediaId +
                        '"]');
                // var slickIndex = $targetSlide.data('slick-index');

                // $(this.selectors.productSlideshow + '.slick-initialized')
                //   .slick('slickGoTo', slickIndex);
            },
            _updatePrice: function (e) {
                var $price = $(this.selectors.price, this.$container);
                var $regularPrice = $(this.selectors.regularPrice, $price);
                var $salePrice = $(this.selectors.salePrice, $price);
                var variant = e.variant;

                $price.removeClass(this.classes.priceOnSale);

                if (variant.compare_at_price > variant.price) {
                    $regularPrice.html(
                        theme.Currency2.formatMoney(
                            variant.compare_at_price,
                            theme.moneyFormat
                        )
                    );

                    $salePrice.html(
                        theme.Currency2.formatMoney(
                            variant.price,
                            theme.moneyFormat
                        )
                    );

                    $price.addClass(this.classes.priceOnSale);
                } else {
                    $regularPrice.html(
                        theme.Currency2.formatMoney(
                            variant.price,
                            theme.moneyFormat
                        )
                    );
                }
            },
            _updateAvailability: function (e) {
                this._updateAddToCart(e);
                this._updatePrice(e);
                if (this.settings.enableBIS === true) {
                    this._updateBIS(e);
                }
            },
            _updateAddToCart: function (e) {
                var variant = e.variant;

                if (variant) {
                    if (variant.available) {
                        this.$addToCart
                            .removeAttr('aria-disabled')
                            .attr('aria-label', theme.strings.addToCart);
                        $(this.selectors.addToCartText, this.$container).text(
                            theme.strings.addToCart
                        );
                        this.$shopifyPaymentButton.show();
                    } else {
                        // The variant doesn't exist, disable submit button and change the text.
                        // This may be an error or notice that a specific variant is not available.
                        this.$addToCart
                            .attr('aria-disabled', true)
                            .attr('aria-label', theme.strings.soldOut);
                        $(this.selectors.addToCartText, this.$container).text(
                            theme.strings.soldOut
                        );
                        this.$shopifyPaymentButton.hide();
                    }
                } else {
                    this.$addToCart
                        .attr('aria-disabled', true)
                        .attr('aria-label', theme.strings.unavailable);
                    $(this.selectors.addToCartText, this.$container).text(
                        theme.strings.unavailable
                    );
                    this.$shopifyPaymentButton.hide();
                }
            },
            _updateBIS: function (e) {
                var variant = e.variant;

                if (variant) {
                    if (variant.available) {
                        this.$BISActions.addClass('hide');
                        this.$availableActions.removeClass('hide');
                    } else {
                        this.$BISTrigger.attr('data-variant-id', variant.id);
                        this.$BISActions.removeClass('hide');
                        this.$availableActions.addClass('hide');
                    }
                } else {
                    this.$BISTrigger.attr('data-variant-id', variant.id);
                    this.$BISActions.removeClass('hide');
                    this.$availableActions.addClass('hide');
                }
            },
            _initBIS: function () {
                this.$BISActions = $(this.selectors.BISActions, this.$container);
                this.$availableActions = $(this.selectors.availableActions, this.$container);
                this.$BISTrigger = $(this.selectors.BISTrigger, this.$container);
            },
            _initDimensions: function () {
                var self = this;
                theme.LibraryLoader.load('dimensions', function () {
                    this.dimensions = new theme.Dimensions($, self.$productDimensions, self.$productDescription);
                });
            },
            _scrollToReviews: function () {
                var scrollTo = $(this.selectors.reviewsSection, this.$container).offset().top;
                $('html,body').animate({scrollTop: scrollTo - 200}, 300);
            },
            _scrollToMobileSeeItStyled: function () {
                var scrollTo = $(this.selectors.mobileSeeItStyled, this.$container)
                    .offset().top;
                $('html,body').animate({scrollTop: scrollTo - 200}, 300);
            },
            _trackVariantChange: function (e) {
                if (!window.snaptr) {
                    return;
                }

                var variant = e.variant;

                if (!variant.id) {
                    return;
                }

                var tracking_id = variant.id;

                snaptr('track', 'VIEW_CONTENT',
                    {
                        'item_ids': [tracking_id]
                    }
                );
            },
            _trackAddToCart: function (item) {
                if (!window.snaptr) {
                    return;
                }

                if (!item.id) {
                    return;
                }

                var tracking_id = item.id;

                snaptr('track', 'ADD_CART',
                    {
                        'item_ids': [tracking_id],
                        'price': item.price / 100,
                        'currency': theme.cartCurrency || '',
                    }
                );
            },
            onUnload: function () {
                this.desktopSlideshow.unload();
                this.desktopThumbnailSlideshow.unload();
                this.desktopSeeItStyledSlideshow.unload();
                this.mobileSlideshow.unload();
                this.mobileSeeItStyledSlideshow.unload();
                this.responsiveTabs.unload();
                this.$container.off(this.namespace);
            }

        });

        return Product;
    })();

    theme.FeaturedProduct = (function () {
        function FeaturedProduct(container) {
            // #todo: tracking?
            var $container = (this.$container = $(container));
            var sectionId = $container.attr('data-section-id');

            this.sectionId = sectionId;
            this.namespace = '.featured-product';

            this.selectors = {
                productListing: '[data-product-listing]',
            };

            this._init();
        }

        FeaturedProduct.prototype = _.assignIn({}, FeaturedProduct.prototype, {
            _init: function () {
                this.$productListing = $(this.selectors.productListing, this.$container);

                var options = {
                    arrows: true,
                    dots: false,
                    slidesToShow: 3,
                    responsive: [
                        {
                            breakpoint: 1160,
                            settings: {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 900,
                            settings: {
                                arrows: true,
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                arrows: true,
                                slidesToShow: 1
                            }
                        },
                    ],
                };

                this.$productListing.slick(options);

                this.ProductListing = new theme.ProductListing(this.$productListing);
            },
            onUnload: function () {
                this.$productListing.slick('unslick');
                this.$container.off(this.namespace);
            }
        });

        return FeaturedProduct;
    })();

    theme.RelatedProducts = (function () {
        function RelatedProducts(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr('data-section-id');

            this.sectionId = sectionId;
            this.namespace = '.related-products';

            this.selectors = {
                relatedProducts: '[data-related-products]',
            };

            this._init();
        }

        RelatedProducts.prototype = _.assignIn({}, RelatedProducts.prototype, {
            _init: function () {
                this.$relatedProducts = $(this.selectors.relatedProducts, this.$container);
                var collectionHandle = this.$relatedProducts.data('related-products');
                var collection_handles = this.$relatedProducts.data('collection_handles');
                var product_id = this.$relatedProducts.data('product-id');
                
                console.log(collection_handles)
                var self = this;

                $.get({
                    url: '/collections/' + collectionHandle + '?view=async-related',
                })
                .done(function (data1) {
                    
                    self.$relatedProducts.empty();
                    for(var i = 0; i < $(data1).children().length; i++) {
                        if($(data1).children().eq(i).data('product-id') != product_id) {
                        
                            self.$relatedProducts.append($(data1).children().eq(i));
                        }
                    }
                    if (collection_handles != '') {
                        var collectionHandles = collection_handles.split('&');
                        var collectionHandle1 = collectionHandles[1];
                        $.get({
                            url: '/collections/' + collectionHandle1 + '?view=async-related',
                        }).done(function (data) {
                            for(var i = 0; i < $(data).children().length; i++) {
                                if($(data).children().eq(i).data('product-id') != product_id) {
                                    self.$relatedProducts.append($(data).children().eq(i));
                                }
                            }
                            if($(data).children().length < 4) {
                                var options = {
                                    arrows: true,
                                    dots: false,
                                    slidesToShow: $(data).children().length,
                                    responsive: [
                                        {
                                            breakpoint: 900,
                                            settings: {
                                                arrows: true,
                                                slidesToShow: 1
                                            }
                                        },
                                    ],
                                };
                            } else {
                                var options = {
                                    arrows: true,
                                    dots: false,
                                    slidesToShow: 4,
                                    responsive: [
                                        {
                                            breakpoint: 900,
                                            settings: {
                                                arrows: true,
                                                slidesToShow: 1
                                            }
                                        },
                                    ],
                                };
                            }
                            self.$relatedProducts.slick(options);
                            self.relatedProductsProductListing = new theme.ProductListing(self.$relatedProducts);
                        });
                    } else {
                        if($(data1).children().length < 4) {
                            var options = {
                                arrows: true,
                                dots: false,
                                slidesToShow: $(data).children().length,
                                responsive: [
                                    {
                                        breakpoint: 900,
                                        settings: {
                                            arrows: true,
                                            slidesToShow: 1
                                        }
                                    },
                                ],
                            };
                        } else {
                            var options = {
                                arrows: true,
                                dots: false,
                                slidesToShow: 4,
                                responsive: [
                                    {
                                        breakpoint: 900,
                                        settings: {
                                            arrows: true,
                                            slidesToShow: 1
                                        }
                                    },
                                ],
                            };
                        }
                        self.$relatedProducts.slick(options);
                        self.relatedProductsProductListing = new theme.ProductListing(self.$relatedProducts);
                    }
                    
                })
                .fail(function () {
                    self.$relatedProducts.hide();
                    console.warn('Could not load related products');
                });
            },
            onUnload: function () {
                this.$relatedProducts.slick('unslick');
                this.$container.off(this.namespace);
            }
        });

        return RelatedProducts;
    })();

    theme.Slideshow = (function () {
        function Slideshow(container) {
            var $container = (this.$container = $(container));
            var sectionId = $container.attr('data-section-id');

            this.sectionId = sectionId;
            this.namespace = '.slideshow';

            this.selectors = {
                slideshow: '.slideshow',
            };

            this.settings = {
                slidesToShow: parseInt($container.attr('data-slides-to-show')),
            };

            this._init();
        }

        Slideshow.prototype = _.assignIn({}, Slideshow.prototype, {
            _init: function () {
                this.$slideshow = $(this.selectors.slideshow, this.$container);

                this.$slideshow.slick(
                    {
                        slidesToShow: this.settings.slidesToShow,
                        slidesToScroll: 1,
                        arrows: true,
                        infinite: true,
                        responsive: [
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ],
                    }
                );
            },
            onUnload: function () {
                this.$slideshow.slick('unslick');
            }
        });

        return Slideshow;
    })();

    theme.ReviewsSlideshow = (function () {
        function ReviewsSlideshow(container) {
            var $container = (this.$container = $(container));
            this.sectionId = $container.attr('data-section-id');

            this._init();
        }

        ReviewsSlideshow.prototype = _.assignIn({}, ReviewsSlideshow.prototype, {
            _init: function () {
                this.$reviewsSlideshow = $('.js-reviews-container-' + this.sectionId);

                this.$reviewsSlideshow.slick({
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: false,
                    autoplaySpeed: 6000,
                    arrows: true,
                    responsive: [
                        {
                            breakpoint: 880,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            },
            onUnload: function () {
                this.$reviewsSlideshow.slick('unslick');
            }
        });

        return ReviewsSlideshow;
    })();

    $(document).ready(function () {
        $('html').removeClass('no-js');
        $('body').removeClass('preload');

        function toggleCollapse() {
            const collapsBloks = $('[data-collapse-trigger]');
            $('body').on('click', '[data-collapse-trigger]', function (e) {
                $(e.target).parent('div').find('[data-collapsible]').toggleClass('active');
            })
        }

        toggleCollapse();

        var sections = new theme.Sections();

        sections.register('popup', theme.Popup);

        sections.register('search-page', theme.SearchPage);
        sections.register('collection', theme.Collection);

        sections.register('desktop-header', theme.DesktopHeader);
        sections.register('desktop-nav', theme.DesktopNav);
        sections.register('mobile-header-and-nav', theme.MobileHeaderAndNav);

        sections.register('product', theme.Product);
        sections.register('featured-product', theme.FeaturedProduct);
        sections.register('related-products', theme.RelatedProducts);

        sections.register('shop-by-collection', theme.ShopByCollection);

        sections.register('slideshow', theme.Slideshow);
        sections.register('reviews-slideshow', theme.ReviewsSlideshow);

        theme.FlashMessages.init();
        theme.Collapsible.init();

        theme.Cart.init();

        theme.AsyncSections.init();

        theme.CustomerTemplates.init();

        var $backToTop = $('[data-back-to-top]');
        if ($backToTop.length > 0) {
            // new theme.BackToTop($backToTop);
        }

        function refreshProductSlider() {
            $('.product-section__mobile-slideshow').slick('refresh');
        }

        function listenerOpenedPopup() {
            const popupEl = document.querySelector(`.spps-sc-game`);
            let isHidden = popupEl.classList.contains('sp-hidden');
            if(isHidden) {
                refreshProductSlider();
            } else {
                setTimeout(listenerOpenedPopup, 1000);
            }
        }

        window.popupDisplayed = function () {
            listenerOpenedPopup();
        }

        window.popupClosed = function () {
            refreshProductSlider();
        }


        // todo: maybe remove this before launching
        // if ("MutationObserver" in window) {
        //     function callback(mutationList, observer) {
        //         for (var i = 0; i < mutationList.length; i++) {
        //             var mutation = mutationList[i];
        //             if (mutation.type === 'attributes' &&
        //                 mutation.attributeName === 'style') {
        //                 var styleAttr = mutation.target.getAttribute('style');
        //                 if (styleAttr.indexOf('padding-bottom') !== -1) {
        //                     var paddingBottom = window.getComputedStyle(mutation.target, null).paddingBottom;
        //                     document.querySelector('.CartDrawer').style.paddingBottom = paddingBottom;
        //                 }
        //             }
        //         }
        //
        //     }
        //
        //     var targetNode = document.querySelector('html');
        //
        //     var pbObserverOptions = {
        //         attributes: true,
        //         subtree: false
        //     }
        //
        //     var pbObserver = new MutationObserver(callback);
        //     pbObserver.observe(targetNode, pbObserverOptions);
        // }

        var sliderAutoplay = $('.slider_wrap').data("autoplay");
        var sliderSpeed = $('.slider_wrap').data("speed");

        $('.slider_wrap').slick({
            autoplay: sliderAutoplay,
            autoplaySpeed: sliderSpeed,
            dots: false,
            appendArrows: ".holder-arrow"
        });

        function imgFilter() {

            if ($('section').hasClass('it-styled')) {

                var filterStart = $('.product-section__variant-thumbnail.is-active').data("filter");
                var keyStart = "." + filterStart;
                var keyStart2 = ".see-it-styled-item";
                var keySlide2 = filterStart;

                $(' .product-section__desktop-slideshow, .product-section__desktop-thumbnails, .desktop-see-it-styled').slick('slickUnfilter');

                $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails, .desktop-see-it-styled').slick('slickGoTo', 0);
                $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickFilter', keyStart).slick('refresh');

                if ($(".desktop-see-it-styled .slick-track > div").hasClass(keySlide2)) {
                    $('.desktop-see-it-styled').slick('slickFilter', keyStart).slick('refresh');
                } else {
                    $('.desktop-see-it-styled').slick('slickFilter', keyStart2).slick('refresh');
                }


                $('.product-section__variant-thumbnail').bind('click', function (e) {

                    var filter = $(this).data("filter");
                    var key = "." + filter;
                    var key2 = ".see-it-styled-item";
                    var keySlide = filter;


                    $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails, .desktop-see-it-styled').slick('slickUnfilter');

                    $(' .product-section__desktop-slideshow, .product-section__desktop-thumbnails, .desktop-see-it-styled').slick('slickGoTo', 0);
                    $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickFilter', key).slick('refresh');

                    if ($(".desktop-see-it-styled .slick-track > div").hasClass(keySlide)) {
                        $('.desktop-see-it-styled').slick('slickFilter', key).slick('refresh');
                    } else {
                        $('.desktop-see-it-styled').slick('slickFilter', key2).slick('refresh');
                    }

                });

            } else {

                var filterStart = $('.product-section__variant-thumbnail.is-active').data("filter");
                var keyStart = "." + filterStart;
                $(' .product-section__desktop-slideshow, .product-section__desktop-thumbnails').slick('slickUnfilter');

                $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickGoTo', 0);
                $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickFilter', keyStart).slick('refresh');

                $('.product-section__variant-thumbnail').bind('click', function (e) {
                    var filter = $(this).data("filter");
                    var key = "." + filter;
                    $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickUnfilter');

                    $(' .product-section__desktop-slideshow, .product-section__desktop-thumbnails').slick('slickGoTo', 0);
                    $(' .product-section__desktop-slideshow,  .product-section__desktop-thumbnails').slick('slickFilter', key).slick('refresh');
                });

            }
        }

        $('.product-section__variant-thumbnail').bind('click', function (e) {
            var badgeIsStock = $(this).data('is-stock');
            var badgeSale = $(this).data('sale');
            var badgeNew = $(this).data('new');
            var badgeTop = $(this).data('top');

            if (badgeIsStock == false) {
                $('.product-badge .badge--text').addClass('hide');
                $('.product-badge .badge--out-of-stock').removeClass('hide');
            } else {
                $('.product-badge .badge--text').removeClass('hide');
                $('.product-badge .badge--out-of-stock').addClass('hide');
                if (badgeNew == true) {
                    $('.product-badge .badge--text').addClass('hide');
                    $('.product-badge .badge--new').removeClass('hide');
                } else {
                    $('.product-badge .badge--text').removeClass('hide');
                    $('.product-badge .badge--new').addClass('hide');
                    if (badgeSale == true) {
                        $('.product-badge .badge--text').addClass('hide');
                        $('.product-badge .badge--sale').removeClass('hide');
                    } else {
                        $('.product-badge .badge--text').removeClass('hide');
                        $('.product-badge .badge--sale').addClass('hide');
                        if (badgeTop == true) {
                            $('.product-badge .badge--text').addClass('hide');
                            $('.product-badge .badge--top-rated').removeClass('hide');
                        } else {
                            $('.product-badge .badge--text').removeClass('hide');
                            $('.product-badge .badge--top-rated').addClass('hide');

                        }
                    }
                }
            }

            if (badgeIsStock == true && badgeNew == false && badgeSale == false && badgeTop == false) {
                $('.product-badge .badge--text').addClass('hide');
            }

        });


        function imgFilterMob() {
            var filterStart = $('.product-section__variant-thumbnail.is-active').data("filter");
            var keyStart = "." + filterStart;
            var keyStart2 = ".mobile-see-it-styled__item";
            var keySlide2 = filterStart;
            $('.product-section__mobile-slideshow, .mobile-see-it-styled.slick-slider').slick('slickUnfilter');

            $('.product-section__mobile-slideshow, .mobile-see-it-styled.slick-slider').slick('slickGoTo', 0);
            $('.product-section__mobile-slideshow').slick('slickFilter', keyStart).slick('refresh');


            if ($(".mobile-see-it-styled.slick-slider  .slick-track > div").hasClass(keySlide2)) {
                $('.mobile-see-it-styled.slick-slider ').slick('slickFilter', keyStart).slick('refresh');
            } else {
                $('.mobile-see-it-styled.slick-slider ').slick('slickFilter', keyStart2).slick('refresh');
            }

            $('.product-section__variant-thumbnail').bind('click', function (e) {
                var filter = $(this).data("filter");
                var key = "." + filter;
                var key2 = ".mobile-see-it-styled__item";
                var keySlide = filter;

                $('.product-section__mobile-slideshow, .mobile-see-it-styled.slick-slider').slick('slickUnfilter');
                $('.product-section__mobile-slideshow, .mobile-see-it-styled.slick-slider').slick('slickGoTo', 0);
                $('.product-section__mobile-slideshow').slick('slickFilter', key).slick('refresh');

                if ($(".mobile-see-it-styled.slick-slider  .slick-track > div").hasClass(keySlide)) {
                    $('.mobile-see-it-styled.slick-slider ').slick('slickFilter', key).slick('refresh');
                } else {
                    $('.mobile-see-it-styled.slick-slider ').slick('slickFilter', key2).slick('refresh');
                }
            });
        }

        if ($(window).width() > 900) {
            imgFilter();
        } else {
            imgFilterMob();
        }

        function videoSrc() {
            var video = $(".video");
            if (video.length) {
                var videoDesctop = $('.video').data("video-desctop");
                var videoMob = $('.video').data("video-mob");


                if ($(window).width() < 767) {
                    video.append("<source src='" + videoMob + "' >");
                } else {
                    video.append("<source src='" + videoDesctop + "' >");
                }
            }
        }

        videoSrc();
        $('.read-more').click("click", function (e) {
            e.preventDefault();
            $('.desc-read-more').slideToggle();
        });
        // window.collectionModelImages = function () {
        //     $('.product-listing .grid-item-img').addClass('active');
        // }

        $( window ).on( "load", function() {
            $('.product-listing .grid-item-img').addClass('active'); 
            setTimeout(window.collectionModelImages, 3000);
        });

        $( document ).ajaxComplete(function() {
            $('.collection-holder-star .okeReviews-reviewsSummary-ratingCount span').each(function(){                
                let testRemove = $(this).html().replace('Reviews', '');
                $(this).html(testRemove);
                let testRemove2 = $(this).html().replace('Review', '');
                $(this).html(testRemove2);
            });
            if ($(window).width() >= 1024) {

            }else {
                $( ".swatch" ).each(function() {
                    $('.swatch').click(function () {
                        $('.swatch').removeClass('active');
                        $(this).addClass('active');
                    });               
                });
            }

            
            
        });
        function prescriptionBtn() {
            let variantUrl = $('.product-section__variant-thumbnail.is-active').data('prescription-btn');
            $('.product-section-form__add-to-cart .prescription-btn').attr('href', variantUrl + '#step-1');
            if(variantUrl == ''){
                $('.product-section-form__add-to-cart .prescription-btn').hide();
            }else{
                $('.product-section-form__add-to-cart .prescription-btn').show();
            }
        }
        prescriptionBtn();
        $('.product-section__variant-thumbnail').click("click", function () {
            prescriptionBtn();
        });

        $('.holder-account .nav-tab a').click("click", function (e) {
            e.preventDefault();
            let click_id = $(this).attr('href');
            let text_nav = $(this).text();
            $('.holder-account .holder-nav .text-nav span').text(text_nav);
            $('.holder-account .holder-nav .text-nav').removeClass('active')
            $('.holder-account .nav-tab li').removeClass('active')
            $(this).parent().addClass('active');
            $('.holder-account .holder-content-tab').removeClass('actve');
            $('.holder-account .holder-content-tab').hide();
            $(click_id).show();
            if ($(window).width() < 767) {
                $('.holder-account .holder-nav ul').hide();
            }
            
        });
        if ($(window).width() < 767) {
            $('.holder-account .holder-nav .text-nav').click("click", function () {
                $(this).toggleClass('active');
                $('.holder-account .holder-nav ul').toggle();
            });
        }


        $( window ).on( "load", function() {            
            function numStrToNum(str) {
                let num = '';
                str.split('').forEach((item) => {
                    if(item !== ',') {
                        num += item;
                    }
                })
                return Number(num);
            }

            let points_sum = numStrToNum($('.points-sum').text());        
            let points_percent = 100 * points_sum / 3000;
            $('.holder-account .holder-bar .bar span').css('width' , points_percent +'%');

            $("body").on('DOMSubtreeModified', ".points-sum", function() {
                let points_sum = numStrToNum($('.points-sum').text());        
                let points_percent = 100 * points_sum / 3000;
                $('.holder-account .holder-bar .bar span').css('width' , points_percent +'%');
                });
                
    
            if (window.location.href.indexOf("orders") != -1) {
                $('.holder-account .holder-content-tab').removeClass('active');
                $('.holder-account .holder-nav ul li').removeClass('active');
                $('.holder-account .holder-nav ul li a[href="#orders"]').parents('li').addClass('active');
                $('#orders').addClass('active');
            }
            $( "#loyaltylion .lion-rewards-list .lion-reward-item__actions button" ).each(function() {
                if($(this).hasClass('lion-action-button--disabled')) {
                    $(this).parents('.lion-reward-item__content').addClass('disabled-active');
                }
              
            
            });
            $(".lion-rule-item--instagram-follow button.lion-instagram-follow__button").text('Follow Us');

            

            // let str = $('.lion-rule-item--pageview button.lion-action-button--tile div').text();
            // let newstr = str.replace(/Wait/i, '');

            // $('.lion-rule-item--pageview button.lion-action-button--tile div').text(newstr);
        });

        $('#RegisterForm').submit(function(e) {
            var err = false,
              current=$(this);
                  current.find('#RegisterForm-password').each(function() {
                      var patternPas = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
                      if(!patternPas.test($(this).val()) || $(this).val()==''){
                          err = true;
                          $(this).addClass('form__input--error');
                          $('form#RegisterForm').removeAttr("onsubmit");
                      } else {
                          $(this).removeClass('form__input--error');
                          //window.Shopify.recaptchaV3.addToken(this, "create_customer");
                          $('form#RegisterForm').attr('onsubmit','window.Shopify.recaptchaV3.addToken(this, "create_customer"); return false;');
                        
                      } 
                  });
                  
                  if (err) {
                      e.preventDefault(); 
                  }
        });
    });
})(j341);