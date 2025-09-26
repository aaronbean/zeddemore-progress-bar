const _ = require('lodash');

const units = {
    ms: 1,
    s: 2,
    m: 3,
    h: 4,
    d: 5,
    w: 6,
    M: 7,
    y: 8,
};

const u = units;

function convertMilliseconds(milliseconds, options) {
    options = options || { };
    const digits = _.isInteger(options.digits) ? options.digits : 3;
    const minUnit = isValidUnit(options.minUnit) ? options.minUnit : u.ms;
    const maxUnit = isValidUnit(options.maxUnit) ? options.maxUnit : u.y;
    const spaced = _.isBoolean(options.spaced) ? options.spaced : false;
    const durationParts = [ ];
    milliseconds = _.isNumber(milliseconds) ? milliseconds : 0;
    let seconds, minutes, hours, days, weeks, months, years = 0;
    const _seconds = (milliseconds / 1000);
    if (_seconds >= 1) {
        seconds = Math.floor(_seconds);
        milliseconds = (milliseconds % (seconds * 1000)).toFixed(digits);
        const _minutes = (seconds / 60);
        if (_minutes >= 1) {
            minutes = Math.floor(_minutes);
            seconds = seconds % (minutes * 60);
            const _hours = (minutes / 60);
            if (_hours >= 1) {
                hours = Math.floor(_hours);
                minutes = minutes % (hours * 60);
                const _days = (hours / 24);
                if (_days >= 1) {
                    days = Math.floor(_days);
                    hours = hours % (days * 24);
                    const _weeks = (days / 7);
                    if (_weeks >= 1) {
                        weeks = Math.floor(_weeks);
                        days = days % (weeks * 7);
                        const _months = (days / 30);
                        if (_months >= 1) {
                            months = Math.floor(_months);
                            days = days % (months * 30);
                            const _years = (days / 365);
                            if (_years >= 1) {
                                years = Math.floor(_years);
                                days = days % (years * 365);
                            }
                        }
                    }
                }
            }
        }
    }
    if ((years > 0) && (minUnit <= u.y) && (maxUnit >= u.y)) durationParts.push(`${ years }y`);
    if ((months > 0) && (minUnit <= u.M) && (maxUnit >= u.M)) durationParts.push(`${ months }M`);
    if ((weeks > 0) && (minUnit <= u.w) && (maxUnit >= u.w)) durationParts.push(`${ weeks }w`);
    if ((days > 0) && (minUnit <= u.d) && (maxUnit >= u.d)) durationParts.push(`${ days }d`);
    if ((hours > 0) && (minUnit <= u.h) && (maxUnit >= u.h)) durationParts.push(`${ hours }h`);
    if ((minutes > 0) && (minUnit <= u.m) && (maxUnit >= u.m)) durationParts.push(`${ minutes }m`);
    if ((seconds > 0) && (minUnit <= u.s) && (maxUnit >= u.s)) durationParts.push(`${ seconds }s`);
    if (((milliseconds > 0) && (minUnit <= u.ms) && (maxUnit >= u.ms)) || !durationParts.length) durationParts.push(`${ milliseconds }ms`);
    return durationParts.join(spaced ? ' ' : '');
}

function isValidUnit(unit) {
    return _.includes(_.values(units), unit);
}

module.exports = {
    convertMilliseconds,
    units,
};
