const c = require('../lib/constants');
const { hexColors: hc } = require('../lib/colors');

module.exports = {
    barCompleteCharacter: c.DEFAULT_BAR_COMPLETE_CHARACTER,
    barGlue: 'ᗧ',
    barGlueColor: hc.YELLOW,
    barIncompleteCharacter: '•',
    useCompletionGradient: true,
};
