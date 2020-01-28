export const forEach = Array.prototype.forEach;

/**
 * Get Computed style value
 * @param {HTMLElement} elm - DOM node
 * @param {string} css - property to evaluate
 * @return {*}
 */
export const getStyleVal = function(elm, css) {
    return (window.getComputedStyle(elm, null).getPropertyValue(css));
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

    return el;
};
