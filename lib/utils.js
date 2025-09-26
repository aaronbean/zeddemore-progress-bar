const _ = require('lodash');

function isStringOrNull(value) {
    return (_.isString(value) || _.isNull(value));
}

module.exports = {
    isStringOrNull,
};
