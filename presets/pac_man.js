const c = require('../lib/constants');
const { hexColors: hc } = require('../lib/colors');

module.exports = {
    barCompleteCharacter: c.DEFAULT_BAR_COMPLETE_CHARACTER,
    barGlue: '\u{1CC72}', // see https://www.unicode.org/L2/L2021/21235-terminals-supplement.pdf
    barGlueColor: hc.YELLOW,
    barIncompleteCharacter: '•',
    useCompletionGradient: true,
};
