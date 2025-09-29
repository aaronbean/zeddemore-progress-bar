const _ = require('lodash');
const chalk = require('chalk');
const { SingleBar } = require('cli-progress');
const stringWidth = require('string-width');

const c = require('./constants');
const { convertMilliseconds, units: u } = require('./date');
const { hexColors: hc, isColor } = require('./colors');
const { isStringOrNull } = require('./utils');
const Presets = require('../presets');
const ZeddemoreProgressMeta = require('./ZeddemoreProgressMeta');

class ZeddemoreProgressBar {

    #alwaysRender = false;
    #autoPadding = true;
    #barCompleteCharacter = c.DEFAULT_BAR_COMPLETE_CHARACTER;
    #barCompleteCharacterColor = null;
    #barEmptyColor = hc.MAKO;
    #barGlue = c.DEFAULT_BAR_GLUE;
    #barGlueColor = hc.GREY;
    #barIncompleteCharacter = c.DEFAULT_BAR_INCOMPLETE_CHARACTER;
    #barIncompleteCharacterColor = null;
    #barSize = c.DEFAULT_BAR_SIZE;
    #delimiter = c.DEFAULT_PROGRESS_DELIMITER;
    #durationClockIndex = 0;
    #durationLabel = c.DEFAULT_DURATION_LABEL;
    #etaLabel = c.DEFAULT_ETA_LABEL;
    #hide = false;
    #initialized = false;
    #message = null;
    /** @type {ZeddemoreProgressMeta} */
    _meta = null;
    #metaDelimiter = c.DEFAULT_PROGRESS_DELIMITER;
    #preset = Presets.standard;
    /** @type {ZeddemoreProgressMeta} */
    #savedMeta = null;
    #savedTotal = null;
    #savedValue = null;
    #showBar = true;
    #showDuration = false;
    #showEta = false;
    #showMessage = true;
    #showPercentage = true;
    #showValue = true;
    /** @type {SingleBar} */
    #singleBar = null;
    #useCompletionGradient = true;

    constructor(options) {
        options = options || { };
        this.alwaysRender = options.alwaysRender;
        this.autoPadding = options.autoPadding;
        this.barCompleteCharacter = options.barCompleteCharacter;
        this.barCompleteCharacterColor = options.barCompleteCharacterColor;
        this.barEmptyColor = options.barEmptyColor;
        this.barGlue = options.barGlue;
        this.barGlueColor = options.barGlueColor;
        this.barIncompleteCharacter = options.barIncompleteCharacter;
        this.barIncompleteCharacterColor = options.barIncompleteCharacterColor;
        this.barSize = options.barSize;
        this.delimiter = options.delimiter;
        this.durationLabel = options.durationLabel;
        this.etaLabel = options.etaLabel;
        this.hide = options.hide;
        this.metaDelimiter = options.metaDelimiter;
        this.preset = options.preset;
        this.showBar = options.showBar;
        this.showDuration = options.showDuration;
        this.showEta = options.showEta;
        this.showMessage = options.showMessage;
        this.showPercentage = options.showPercentage;
        this.showValue = options.showValue;
        this.useCompletionGradient = options.useCompletionGradient;
    }

    get alwaysRender() {
        return this.#alwaysRender;
    }

    set alwaysRender(alwaysRender) {
        if (_.isBoolean(alwaysRender)) this.#alwaysRender = alwaysRender;
    }

    get autoPadding() {
        return this.#autoPadding;
    }

    set autoPadding(autoPadding) {
        if (_.isBoolean(autoPadding)) this.#autoPadding = autoPadding;
    }

    get bar() {
        return this.#singleBar;
    }

    get barCompleteCharacter() {
        return this.#barCompleteCharacter;
    }

    set barCompleteCharacter(character) {
        if (_.isString(character) && (character.length > 0)) this.#barCompleteCharacter = character;
    }

    get barCompleteCharacterColor() {
        return this.#barCompleteCharacterColor;
    }

    set barCompleteCharacterColor(color) {
        if (isColor(color)) this.#barCompleteCharacterColor = color;
    }

    get barEmptyColor() {
        return this.#barEmptyColor;
    }

    set barEmptyColor(color) {
        if (isColor(color)) this.#barEmptyColor = color;
    }

    get barGlue() {
        return this.#barGlue;
    }

    set barGlue(glue) {
        if (_.isString(glue)) this.#barGlue = glue;
    }

    get barGlueColor() {
        return this.#barGlueColor;
    }

    set barGlueColor(color) {
        if (isColor(color)) this.#barGlueColor = color;
    }

    get barGradient() {
        return [ '#FF0000', '#E31C00', '#C63900', '#AA5500',
            '#8E7100', '#718E00', '#55AA00', '#39C600',
            '#1CE300', '#00FF00' ];
    }

    get barIncompleteCharacter() {
        return this.#barIncompleteCharacter;
    }

    set barIncompleteCharacter(character) {
        if (_.isString(character) && (character.length > 0)) this.#barIncompleteCharacter = character;
    }

    get barIncompleteCharacterColor() {
        return this.#barIncompleteCharacterColor;
    }

    set barIncompleteCharacterColor(color) {
        if (isColor(color)) this.#barIncompleteCharacterColor = color;
    }

    get barSize() {
        return this.#barSize;
    }

    set barSize(size) {
        if (_.isInteger(size) && (size > 0)) this.#barSize = size;
    }

    get delimiter() {
        return this.#delimiter;
    }

    set delimiter(delimiter) {
        if (_.isString(delimiter)) this.#delimiter = delimiter;
    }

    get durationClocks() {
        return [ '🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚' ];
    }

    get durationLabel() {
        return this.#durationLabel;
    }

    set durationLabel(durationLabel) {
        if (_.isString(durationLabel)) this.#durationLabel = durationLabel;
    }

    get etaLabel() {
        return this.#etaLabel;
    }

    set etaLabel(etaLabel) {
        if (_.isString(etaLabel)) this.#etaLabel = etaLabel;
    }

    get hasBar() {
        return (this.#singleBar instanceof SingleBar);
    }

    get hasPreset() {
        return Presets.isPreset(this.#preset);
    }

    get hide() {
        return this.#hide;
    }

    set hide(hide) {
        if (_.isBoolean(hide)) this.#hide = hide;
    }

    get initialized() {
        return this.#initialized;
    }

    set initialized(initialized) {
        if (_.isBoolean(initialized)) this.#initialized = initialized;
    }

    get isDefaultDurationLabel() {
        return (this.durationLabel === c.DEFAULT_DURATION_LABEL);
    }

    get isEmpty() {
        return (this.value === 0);
    }

    get message() {
        return this.#message;
    }

    set message(message) {
        if (_.isString(message)) this.#message = message.trim();
        this.draw();
    }

    get meta() {
        return this._meta;
    }

    set meta(meta) {
        if (!_.isObject(meta)) return;
        this._applyMeta(meta);
        if (this.hasBar) this.bar.meta = this._meta.asJson;
        this.draw();
    }

    get meta1() {
        return this._meta.meta1;
    }

    set meta1(meta1) {
        if (isStringOrNull(meta1)) this._meta.meta1 = meta1.trim();
    }

    get meta2() {
        return this._meta.meta2;
    }

    set meta2(meta2) {
        if (isStringOrNull(meta2)) this._meta.meta2 = meta2.trim();
    }

    get meta3() {
        return this._meta.meta3;
    }

    set meta3(meta3) {
        if (isStringOrNull(meta3)) this._meta.meta3 = meta3.trim();
    }

    get meta4() {
        return this._meta.meta4;
    }

    set meta4(meta4) {
        if (isStringOrNull(meta4)) this._meta.meta4 = meta4.trim();
    }

    get meta5() {
        return this._meta.meta5;
    }

    set meta5(meta5) {
        if (isStringOrNull(meta5)) this._meta.meta5 = meta5.trim();
    }

    get meta6() {
        return this._meta.meta6;
    }

    set meta6(meta6) {
        if (isStringOrNull(meta6)) this._meta.meta6 = meta6.trim();
    }

    get meta7() {
        return this._meta.meta7;
    }

    set meta7(meta6) {
        if (isStringOrNull(meta6)) this._meta.meta7 = meta6.trim();
    }

    get meta8() {
        return this._meta.meta8;
    }

    set meta8(meta8) {
        if (isStringOrNull(meta8)) this._meta.meta8 = meta8.trim();
    }

    get meta9() {
        return this._meta.meta9;
    }

    set meta9(meta9) {
        if (isStringOrNull(meta9)) this._meta.meta9 = meta9.trim();
    }

    get metaDelimiter() {
        return this.#delimiter;
    }

    set metaDelimiter(delimiter) {
        if (_.isString(delimiter)) this.#metaDelimiter = delimiter;
    }

    get preset() {
        return this.#preset;
    }

    set preset(preset) {
        if (Presets.isPreset(preset)) {
            this.#preset = preset;
            this.#applyPreset(preset);
        }
    }

    get showBar() {
        return this.#showBar;
    }

    set showBar(showBar) {
        if (_.isBoolean(showBar)) this.#showBar = showBar;
    }

    get showDuration() {
        return this.#showDuration;
    }

    set showDuration(showDuration) {
        if (_.isBoolean(showDuration)) this.#showDuration = showDuration;
    }

    get showEta() {
        return this.#showEta;
    }

    set showEta(showEta) {
        if (_.isBoolean(showEta)) this.#showEta = showEta;
    }

    get showMessage() {
        return this.#showMessage;
    }

    set showMessage(showMessage) {
        if (_.isBoolean(showMessage)) this.#showMessage = showMessage;
    }

    get showPercentage() {
        return this.#showPercentage;
    }

    set showPercentage(showPercentage) {
        if (_.isBoolean(showPercentage)) this.#showPercentage = showPercentage;
    }

    get showValue() {
        return this.#showValue;
    }

    set showValue(showValue) {
        if (_.isBoolean(showValue)) this.#showValue = showValue;
    }

    get total() {
        if (!this.hasBar) return 0;
        return this.bar.getTotal();
    }

    set total(total) {
        if (!this.hasBar || !_.isInteger(total) || (total < 0)) return;
        this.bar.setTotal(total);
        this.render();
    }

    get useCompletionGradient() {
        return this.#useCompletionGradient;
    }

    set useCompletionGradient(useCompletionGradient) {
        if (_.isBoolean(useCompletionGradient)) this.#useCompletionGradient = useCompletionGradient;
    }

    get value() {
        if (!this.hasBar) return 0;
        return this.bar.value;
    }

    set value(value) {
        if (!this.hasBar || !_.isInteger(value) || (value < 0)) return;
        this.bar.update(value);
        this.render();
    }

    _applyMeta(meta) {
        if (!_.isObject(meta)) return;
        this.meta.apply(meta);
    }

    #applyPreset(preset) {
        if (Presets.isPreset(preset)) {
            this.barCompleteCharacter = preset.barCompleteCharacter;
            this.barCompleteCharacterColor = preset.barCompleteCharacterColor;
            this.barEmptyColor = preset.barEmptyColor;
            this.barGlue = preset.barGlue;
            this.barGlueColor = preset.barGlueColor;
            this.barIncompleteCharacter = preset.barIncompleteCharacter;
            this.barIncompleteCharacterColor = preset.barIncompleteCharacterColor;
            this.useCompletionGradient = preset.useCompletionGradient;
        }
    }

    #buildFormat() {
        const formatParts = [ ];
        if (this.showBar && this.showPercentage) {
            formatParts.push('{bar} {percentage}');
        } else {
            if (this.showBar) formatParts.push('{bar}');
            if (this.showPercentage) formatParts.push('{percentage}');
        }
        if (this.showDuration) formatParts.push(`{duration}`);
        if (this.showEta) formatParts.push(`{eta}`);
        if (this.showValue) formatParts.push('{value}/{total}');
        if (this.showMessage) formatParts.push('{message}');
        return formatParts.join(this.delimiter);
    }

    #buildMessage() {
        const metaMessage = this.meta.asMessage;
        return _.isString(this.message) ? `${ metaMessage } | ${ this.message }` : metaMessage;
    }

    clear() {
        if (!this.hasBar) return;
        this.bar.update(0);
        this.bar.setTotal(0);
        this.clearMessage();
    }

    clearMessage() {
        this.#message = null;
        if (!this.hasBar) return;
        this.bar.update({ message: this.#buildMessage() });
        this.render();
    }

    #createSingleBar(options) {
        options = options || { };
        const defaults = {
            autopadding: this.autoPadding,
            barCompleteChar: this.barCompleteCharacter,
            barGlue: this.barGlue,
            barIncompleteChar: this.barIncompleteCharacter,
            barsize: this.barSize,
            emptyOnZero: true,
            format: this.#formatter.bind(this),
            hideCursor: true,
        };
        _.defaults(options, defaults);
        const bar = new SingleBar(options);
        bar.on('stop', this.#onStop.bind(this));
        bar.meta = { };
        return bar;
    }

    defaultRender() {
        if (!this.hasBar || !this.alwaysRender) return;
        this.bar.render();
    }

    draw() {
        if (!this.hasBar) return;
        this.bar.update({ message: this.#buildMessage() });
        this.render();
    }

    #formatBar(progress, completed, incompleted, size, glue) {
        const completeSize = Math.round(progress * size);
        const incompleteSize = size - completeSize;
        let completedColor = this.isEmpty ? this.barEmptyColor : this.barCompleteCharacterColor;
        let glueColor = this.barGlueColor;
        let incompleteColor = this.isEmpty ? this.barEmptyColor : this.barIncompleteCharacterColor;
        if (this.useCompletionGradient && !this.isEmpty) {
            const barGradientIndex = Math.min(Math.floor(progress * this.barGradient.length), this.barGradient.length - 1);
            completedColor = this.barGradient[ barGradientIndex ];
        }
        let barCompleted = completed.substring(0, completeSize);
        if (isColor(completedColor)) barCompleted = chalk.hex(completedColor)(barCompleted);
        let barGlue = glue;
        if (isColor(glueColor)) barGlue = chalk.hex(glueColor)(barGlue);
        let barIncomplete = incompleted.substring(0, incompleteSize);
        if (isColor(incompleteColor)) barIncomplete = chalk.hex(incompleteColor)(barIncomplete);
        return barCompleted + barGlue + barIncomplete;
    }

    #formatDuration(milliseconds) {
        const clock = this.isDefaultDurationLabel ? this.durationClocks[ this.#durationClockIndex ] : this.durationLabel;
        this.#durationClockIndex = (this.#durationClockIndex + 1) % this.durationClocks.length;
        return `${ clock }${ this.#formatTime(milliseconds) }`;
    }

    #formatEta(milliseconds) {
        return `${ this.etaLabel }${ this.#formatTime(milliseconds) }`;
    }

    #formatPercentage(percentage) {
        let _percentage = percentage.toString() + '%';
        if (this.autoPadding) _percentage = _percentage.padStart(4, ' ');
        if (this.useCompletionGradient) {
            const gradientIndex = Math.min(Math.floor(percentage / 10), this.barGradient.length - 1);
            const percentageColor = this.isEmpty ? this.barEmptyColor : this.barGradient[ gradientIndex ];
            _percentage = chalk.hex(percentageColor)(_percentage);
        }
        return _percentage;
    }

    #formatTime(milliseconds) {
        return convertMilliseconds(milliseconds, { digits: 0, minUnit: u.s, spaced: false });
    }

    #formatValue(value, total) {
        const _value = value.toString();
        if (!this.autoPadding) return _value;
        const _total = total.toString();
        return _value.padStart(_total.length, '0');
    }

    #formatter(options, params, payload) {
        if (this.hide) return '';
        let s = this.#buildFormat();
        const progress = params.progress;
        const percentage = Math.floor(progress * 100);
        const stopTime = params.stopTime || Date.now();
        const elapsedTime = Math.round(stopTime - params.startTime);
        const calculatedPayload = { };
        const barCompleteString = options.barCompleteString.replaceAll(/\S/g, this.barCompleteCharacter);
        const barIncompleteString = options.barIncompleteString.replaceAll(/\S/g, this.barIncompleteCharacter);
        const processing = ((percentage > 0) && (percentage < 100));
        const barSize = processing ? (this.barSize - this.barGlue.length) : this.barSize;
        const barGlue = processing ? this.barGlue : '';
        if (this.showBar) calculatedPayload.bar = this.#formatBar(progress, barCompleteString, barIncompleteString, barSize, barGlue);
        if (this.showPercentage) calculatedPayload.percentage = this.#formatPercentage(percentage);
        if (this.showValue) calculatedPayload.total = params.total.toString();
        if (this.showValue) calculatedPayload.value = this.#formatValue(params.value, params.total);
        if (this.showEta) calculatedPayload.eta = this.#formatEta(params.eta * 1000);
        if (this.showDuration) calculatedPayload.duration = this.#formatDuration(elapsedTime);
        const context = _.defaults(calculatedPayload, payload);
        s = s.replace(/\{(\w+)}/g, function(match, key){
            if (typeof context[ key ] !== 'undefined') return context[ key ];
            return match;
        });
        const fullMargin = Math.max(0, params.maxWidth - stringWidth(s) -2);
        const halfMargin = Math.floor(fullMargin / 2);
        switch (options.align) {
            case 'right': s = (fullMargin > 0) ? ' '.repeat(fullMargin) + s : s; break;
            case 'center': s = (halfMargin > 0) ? ' '.repeat(halfMargin) + s : s; break;
            case 'left':
            default: break;
        }
        return s;
    }

    increment(amount = 1) {
        if (!this.hasBar || !_.isInteger(amount) || (amount < 1)) return;
        this.bar.increment(amount);
        this.defaultRender();
    }

    initialize(options) {
        options = options || { };
        this.#singleBar = this.#createSingleBar(options);
        this._meta = new ZeddemoreProgressMeta({ ...options, delimiter: this.metaDelimiter });
        this.initialized = true;
    }

    #onStop() {
        const savedBarIncompleteCharacter = this.barIncompleteCharacter;
        const savedShowValue = this.showValue;
        const savedShowDuration = this.showDuration;
        const savedShowEta = this.showEta;
        if (this.isEmpty) {
            this.barIncompleteCharacter = this.barCompleteCharacter;
            this.showValue = false;
            this.showDuration = false;
        }
        this.showEta = false;
        this.draw();
        this.barIncompleteCharacter = savedBarIncompleteCharacter;
        this.showValue = savedShowValue;
        this.showDuration = savedShowDuration;
        this.showEta = savedShowEta;
    }

    render() {
        if (!this.hasBar) return;
        this.bar.render();
    }

    restore() {
        if (!this.hasBar || !(this.#savedMeta instanceof ZeddemoreProgressMeta)) return;
        this.bar.total = this.#savedTotal;
        this.bar.value = this.#savedValue;
        this.meta.apply(this.#savedMeta.asJson);
        this.bar.meta = this.meta.asJson;
        this.draw();
    }

    save() {
        if (!this.hasBar) return;
        this.#savedMeta = new ZeddemoreProgressMeta({ delimiter: this.metaDelimiter });
        this.#savedMeta.apply(this.bar.meta);
        this.#savedTotal = this.bar.getTotal();
        this.#savedValue = this.bar.value;
    }

    setMessage(message) {
        if (!this.hasBar || !_.isString(message)) return;
        this.#message = message.trim();
        this.draw();
    }

    start(total, startValue = 0) {
        if (!this.hasBar) return;
        this.bar.start(total, startValue, { message: '' });
    }

    stop() {
        if (!this.hasBar) return;
        this.bar.stop();
    }

}

module.exports = ZeddemoreProgressBar;
