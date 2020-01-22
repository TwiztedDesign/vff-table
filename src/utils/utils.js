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
 * @param {string} id
 * @param {array} classNames
 * @param {object} style - style options
 * @return {HTMLElement}
 */
export const createElement = function(type, id, classNames, style) {
    const el = document.createElement(type);

    id && (el.id = id);

    classNames && classNames.length && classNames.forEach(function(className) {
        el.classList.add(className);
    });

    style && Object.keys(style).forEach(function(property) {
        el.style[property] = style[property];
    });
    return el;
};
