const _ = require('lodash');

const pacMan = require('../presets/pac_man');
const pacManLegacy = require('../presets/pac_man_legacy');
const { Presets: CliPresets } = require('cli-progress');
const standard = require('../presets/standard');

function isPreset(preset) {
    return _.isObject(preset);
}

function standardizeCliPreset(preset) {
    preset = preset || { };
    return {
        barCompleteCharacter: preset.barCompleteChar,
        barIncompleteCharacter: preset.barIncompleteChar,
        useCompletionGradient: preset.useCompletionGradient || false,
    };
}

module.exports = {
    isPreset,
    legacy: standardizeCliPreset(CliPresets.legacy),
    pacMan,
    pacManLegacy,
    shades_classic: standardizeCliPreset(CliPresets.shades_classic),
    shades_grey: standardizeCliPreset(CliPresets.shades_grey),
    rect: standardizeCliPreset(CliPresets.rect),
    standard,
};
