const _ = require('lodash');
const { SingleBar } = require('cli-progress');

const c = require('./constants');
const { isStringOrNull } = require('./utils');

class ZeddemoreProgressMeta {

    #delimiter = c.DEFAULT_PROGRESS_DELIMITER;
    #meta1 = null;
    #meta2 = null;
    #meta3 = null;
    #meta4 = null;
    #meta5 = null;
    #meta6 = null;
    #meta7 = null;
    #meta8 = null;
    #meta9 = null;

    constructor(options) {
        options = options || { };
        this.delimiter = options.delimiter;
        this.apply(options);
    }

    get asJson() {
        return {
            meta1: this.meta1,
            meta2: this.meta2,
            meta3: this.meta3,
            meta4: this.meta4,
            meta5: this.meta5,
            meta6: this.meta6,
            meta7: this.meta7,
            meta8: this.meta8,
            meta9: this.meta9,
        };
    }

    get asMessage() {
        const messageParts = [ ];
        if (_.isString(this.meta1)) messageParts.push(this.meta1);
        if (_.isString(this.meta2)) messageParts.push(this.meta2);
        if (_.isString(this.meta3)) messageParts.push(this.meta3);
        if (_.isString(this.meta4) && (this.meta4 !== this.meta3)) messageParts.push(this.meta4);
        if (_.isString(this.meta5)) messageParts.push(this.meta5);
        if (_.isString(this.meta6)) messageParts.push(this.meta6);
        if (_.isString(this.meta7)) messageParts.push(this.meta7);
        if (_.isString(this.meta8)) messageParts.push(this.meta8);
        if (_.isString(this.meta9)) messageParts.push(this.meta9);
        return messageParts.join(this.#delimiter);
    }

    get delimiter() {
        return this.#delimiter;
    }

    set delimiter(delimiter) {
        if (_.isString(delimiter)) this.#delimiter = delimiter;
    }

    fromSingleBar(singleBar) {
        if (!(singleBar instanceof SingleBar)) return;
        if (!_.isObject(singleBar.meta)) return;
        this.meta1 = singleBar.meta.meta1 || null;
        this.meta2 = singleBar.meta.meta2 || null;
        this.meta3 = singleBar.meta.sprite || null;
        this.meta4 = singleBar.meta.meta4 || null;
        this.meta5 = singleBar.meta.meta5 || null;
        this.meta6 = singleBar.meta.meta6 || null;
        this.meta7 = singleBar.meta.meta7 || null;
        this.meta8 = singleBar.meta.meta8 || null;
        this.meta9 = singleBar.meta.meta9 || null;
    }

    get meta1() {
        return this.#meta1;
    }

    set meta1(meta1) {
        if (isStringOrNull(meta1)) this.#meta1 = _.isString(meta1) ? meta1.trim() : null;
    }

    get meta2() {
        return this.#meta2;
    }

    set meta2(meta2) {
        if (isStringOrNull(meta2)) this.#meta2 = _.isString(meta2) ? meta2.trim() : null;
    }

    get meta3() {
        return this.#meta3;
    }

    set meta3(meta3) {
        if (isStringOrNull(meta3)) this.#meta3 = _.isString(meta3) ? meta3.trim() : null;
    }

    get meta4() {
        return this.#meta4;
    }

    set meta4(meta4) {
        if (isStringOrNull(meta4)) this.#meta4 = _.isString(meta4) ? meta4.trim() : null;
    }

    get meta5() {
        return this.#meta5;
    }

    set meta5(meta5) {
        if (isStringOrNull(meta5)) this.#meta5 = _.isString(meta5) ? meta5.trim() : null;
    }

    get meta6() {
        return this.#meta6;
    }

    set meta6(meta6) {
        if (isStringOrNull(meta6)) this.#meta6 = _.isString(meta6) ? meta6.trim() : null;
    }

    get meta7() {
        return this.#meta7;
    }

    set meta7(meta7) {
        if (isStringOrNull(meta7)) this.#meta7 = _.isString(meta7) ? meta7.trim() : null;
    }

    get meta8() {
        return this.#meta8;
    }

    set meta8(meta8) {
        if (isStringOrNull(meta8)) this.#meta8 = _.isString(meta8) ? meta8.trim() : null;
    }

    get meta9() {
        return this.#meta9;
    }

    set meta9(meta9) {
        if (isStringOrNull(meta9)) this.#meta9 = _.isString(meta9) ? meta9.trim() : null;
    }

    get values() {
        return {
            meta1: this.meta1,
            meta2: this.meta2,
            meta3: this.meta3,
            meta4: this.meta4,
            meta5: this.meta5,
            meta6: this.meta6,
            meta7: this.meta7,
            meta8: this.meta8,
            meta9: this.meta9,
        };
    }

    apply(meta) {
        if (!_.isObject(meta)) return;
        const PROPERTIES = [ 'meta1', 'meta2', 'meta3', 'meta4', 'meta5', 'meta6', 'meta7', 'meta8', 'meta9' ];
        for (const property of PROPERTIES) {
            if (!meta.hasOwnProperty(property)) continue;
            if (_.isNull(meta[ property ])) this[ property ] = null;
            if (_.isString(meta[ property ])) this[ property ] = meta[ property ].trim();
        }
    }

}

module.exports = ZeddemoreProgressMeta;
