const _ = require('lodash');

function isColor(color) {
    return _.isString(color) && (color.length > 0) && (color.startsWith('#'));
}

const hexColors = {
    BLACK: '#000000',
    BLUE: '#0000FF',
    CYAN: '#00FFFF',
    DARK_ART_MAILBOX_BROWN: '#7F4C07',
    GREEN: '#00FF00',
    GREY: '#727272',
    HUNTER_GREEN: '#3C6E47',
    JIMP: '#FF0000',
    MAKO: '#43454A',
    MERCURY: '#E1E1E1',
    ORANGE: '#FFA500',
    PALE_GREEN: '#d6ebd3',
    PALE_YELLOW: '#fff4cd',
    PALE_RED: '#f9cccd',
    PURPLE: '#800080',
    RED: '#FF0000',
    VIOLET: '#7F00FF',
    WHITE: '#FFFFFF',
    YELLOW: '#FFFF00',
};

module.exports = {
    hexColors,
    isColor,
};
