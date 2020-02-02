export const forEach = Array.prototype.forEach;
export const toArray = Array.prototype.slice;
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
