export const forEach = function(obj) {
    return Array.prototype.forEach.call(obj, arguments);
};
export const toArray = function(obj) {
    return Array.prototype.slice.call(obj, arguments);
};

/**
 * @param {string} url
 * @return {Promise<Response>}
 * @private
 */
export const _fetch = function(url) {
    /**
     * @param response
     * @return {*}
     * @private
     */
    function _checkStatus(response) {
        if (response.ok) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    /**
     * @param response
     * @return {any | Promise<any>}
     * @private
     */
    function _parseJson(response) {
        return response.json();
    }

    return fetch(url)
        .then(_checkStatus)
        .then(_parseJson)
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            throw error;
        });
};

/**
 * Get Computed style value
 * @param {HTMLElement} el - DOM node
 * @param {string} css - property to evaluate
 * @return {*}
 */
export const getStyleVal = function(el, css) {
    return (window.getComputedStyle(el, null).getPropertyValue(css));
};

/**
 * @param {string} type - HTML elements types as: link , div etc..
 * @param {object} attributes
 * @return {HTMLElement}
 */
export const createElement = function(type, attributes = {}) {
    const el = document.createElement(type);

    attributes.id && (el.id = attributes.id);

    attributes.classList && attributes.classList.length && attributes.classList.forEach(function(className) {
        el.classList.add(className);
    });

    attributes.style && Object.keys(attributes.style).forEach(function(property) {
        el.style[property] = attributes.style[property];
    });

    attributes.data && Object.keys(attributes.data).forEach(function(dataName) {
        el.dataset[dataName] = attributes.data[dataName];
    });

    return el;
};
