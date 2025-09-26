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
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let weeks = 0;
    let months = 0;
    let years = 0;
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
    const showYears = (years > 0) && (minUnit <= u.y) && (maxUnit >= u.y);
    const showMonths = ((months > 0) || showYears) && (minUnit <= u.M) && (maxUnit >= u.M);
    const showWeeks = ((weeks > 0) || showMonths) && (minUnit <= u.w) && (maxUnit >= u.w);
    const showDays = ((days > 0) || showWeeks) && (minUnit <= u.d) && (maxUnit >= u.d);
    const showHours = ((hours > 0) || showDays) && (minUnit <= u.h) && (maxUnit >= u.h);
    const showMinutes = ((minutes > 0) || showHours) && (minUnit <= u.m) && (maxUnit >= u.m);
    const showSeconds = ((seconds > 0) || showMinutes || !durationParts.length) && (minUnit <= u.s) && (maxUnit >= u.s);
    const showMilliseconds = ((milliseconds > 0) || !durationParts.length) && (minUnit <= u.ms) && (maxUnit >= u.ms);
    if (showYears) durationParts.push(`${ years }y`);
    if (showMonths) durationParts.push(`${ months.toString().padStart(2, '0') }M`);
    if (showWeeks) durationParts.push(`${ weeks }w`);
    if (showDays) durationParts.push(`${ days }d`);
    if (showHours) durationParts.push(`${ hours.toString().padStart(2, '0') }h`);
    if (showMinutes) durationParts.push(`${ minutes.toString().padStart(2, '0') }m`);
    if (showSeconds) durationParts.push(`${ seconds.toString().padStart(2, '0') }s`);
    if (showMilliseconds || !durationParts.length) durationParts.push(`${ milliseconds.toString().padStart(3, '0') }ms`);
    return durationParts.join(spaced ? ' ' : '');
}

function isValidUnit(unit) {
    return _.includes(_.values(units), unit);
}

module.exports = {
    convertMilliseconds,
    units,
};
