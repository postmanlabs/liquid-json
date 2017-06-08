/**!
 * Originally written by:
 * https://github.com/sindresorhus/parse-json
 */
var fallback = require('../vendor/parse'),
    bomb = require('./bomb'),
    FALLBACK_MODE = 'json',
    ERROR_NAME = 'JSONError',
    BOOLEAN = 'boolean',
    FUNCTION = 'function',
    NUM_ZERO = 0,

    parse; // fn

/**
 * Accept a string as JSON and return an object.
 * @private
 *
 * @param {String} text The input stringified JSON object to be parsed.
 * @param {Function=} [reviver] A customizer function to be used within the fallback (BOM friendly) JSON parser.
 * @param {Boolean=} [strict] Set to true to treat the occurrence of BOM as a fatal error.
 *
 * @returns {Object} The parsed JSON object constructed from text
 * @throws {SyntaxError} If `text` is not a valid JSON
 * @throws {SyntaxError} In `strict` mode if `text` contains BOM
 *
 * @returns {Object} - Returns JS Object derived after parsing `text` parameter
 */
parse = function (text, reviver, strict) {
    var bomMarkerIndex = bomb.indexOfBOM(text);

    if (bomMarkerIndex) {
        if (strict) {
            throw SyntaxError('Unexpected byte order mark found in first ' + bomMarkerIndex + ' character(s)');
        }
        // clean up BOM if not strict
        text = text.slice(bomMarkerIndex);
    }

    try { // first try and use normal JSON.parse as this is faster
        return JSON.parse(text, reviver);
    }
    catch (err) { // if JSON.parse fails, we try using a more verbose parser
        fallback.parse(text, {
            mode: FALLBACK_MODE,
            reviver: reviver
        });

        // if there was an error in this catch block, `fallback.parse` should raise same error. hence this `throw`
        // will never get executed. if it does not, we still throw original error.
        throw err;
    }
};

module.exports = {
    /**
     * Converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is
     * specified, or optionally including only the specified properties if a replacer array is specified.
     *
     * @param {Object|Array} text - The value to convert to a JSON string
     *
     * @param {Function=} replacer - A function that alters the behavior of the stringification process,
     * or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of
     * the value object to be included in the JSON string. If this value is null or not provided, all properties of
     * the object are included in the resulting JSON string.
     *
     * @param  {Number|String=} indent A String or Number object that's used to insert white space into the output
     * JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use
     * as white space; this number is capped at 10 if it's larger than that. Values less than 1 indicate that
     * no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's
     * longer than that) is used as white space. If this parameter is not provided (or is null), no white space is
     * used.
     *
     * @returns {Object}
     *
     * @throws {JSONError} If the `text` parameter contains invalid JSON syntax
     */
    parse: function (text, reviver, relaxed) {
        if ((typeof reviver === BOOLEAN) && (relaxed === null)) {
            relaxed = reviver;
            reviver = null;
        }

        try {
            return parse(text, reviver, relaxed);
        }
        // we do this simply to set the error name and as such making it more identifiable
        catch (err) {
            err.name = ERROR_NAME;
            throw err;
        }
    },

    /**
     * Converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is
     * specified, or optionally including only the specified properties if a replacer array is specified.
     *
     * @param {Object|Array} value - The value to convert to a JSON string
     *
     * @param {Function=} replacer - A function that alters the behavior of the stringification process,
     * or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of
     * the value object to be included in the JSON string. If this value is null or not provided, all properties of
     * the object are included in the resulting JSON string.
     *
     * @param  {Number|String=} indent A String or Number object that's used to insert white space into the output
     * JSON string for readability purposes. If this is a Number, it indicates the number of space characters to use
     * as white space; this number is capped at 10 if it's larger than that. Values less than 1 indicate that
     * no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's
     * longer than that) is used as white space. If this parameter is not provided (or is null), no white space is
     * used.
     *
     * @returns {String}
     *
     * @throws {JSONError} If the value cannot be converted to JSON
     */
    stringify: function (value, replacer, indent) {
        try {
            // eslint-disable-next-line prefer-spread
            return JSON.stringify(value, replacer, indent);
        }
        // we do this simply to set the error name and as such making it more identifiable
        catch (err) {
            err.name = ERROR_NAME;
            throw err;
        }
    },

    async: {
        /**
         * Parses a JSON string, constructing the JavaScript value or object described by the string. An optional
         * reviver function can be provided to perform a transformation on the resulting object before it is returned.
         *
         * This is an asynchronous variant of JSON.parse() and accepts a callback where it returns the result as
         * well as the error (if any.) It does not throw anything that one would otherwise need to trap within a
         * try-catch block.
         *
         * @param {String} text - The string to parse as JSON
         *
         * @param {Object=} options
         *
         * @param {Function=} options.reviver - If a function, prescribes how the value originally produced by parsing
         * is transformed, before being returned.
         *
         * @param {Boolean=true} options.relaxed - When set to `false`, this causes the presence of `BOM` mark in `text`
         * parameter as a fatal error. Otherwise, the BOM is stripped out before parsing.
         *
         * @param {Function} callback - receives parameters `err:Error, json:Object`
         */
        parse: function (text, options, callback) {
            // normalise polymorphic function to make `options` optional
            if (typeof options === FUNCTION && !callback) {
                callback = options;
                options = null;
            }

            // check whether callback is a function and otherwise unset to avoid erroneous calls
            (typeof callback !== FUNCTION) && (callback = null);

            // move up the event loop to make this asynchronous
            setTimeout(function () {
                var reviver,
                    relaxed,
                    json;

                // get options, if provided by user
                if (options) {
                    reviver = options.reviver;
                    relaxed = options.relaxed;
                }

                try {
                    json = parse(text, reviver, relaxed);
                }
                catch (err) {
                    err.name = ERROR_NAME;
                    callback && callback(err);
                }

                callback && callback(null, json);
            }, NUM_ZERO);
        },

        /**
         * Converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is
         * specified, or optionally including only the specified properties if a replacer array is specified.
         *
         * This is an asynchronous variant of JSON.stringify() and accepts a callback where it returns the result as
         * well as the error (if any.) It does not throw anything that one would otherwise need to trap within a
         * try-catch block.
         *
         * @param {Object|Array} value - The value to convert to a JSON string
         *
         * @param {Object=} options
         *
         * @param {Function=} options.replacer - A function that alters the behavior of the stringification process,
         * or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of
         * the value object to be included in the JSON string. If this value is null or not provided, all properties of
         * the object are included in the resulting JSON string.
         *
         * @param  {Number|String=} options.indent A String or Number object that's used to insert white space into the
         * output JSON string for readability purposes. If this is a Number, it indicates the number of space characters
         * to use as white space; this number is capped at 10 if it's larger than that. Values less than 1 indicate that
         * no space should be used. If this is a String, the string (or the first 10 characters of the string, if it's
         * longer than that) is used as white space. If this parameter is not provided (or is null), no white space is
         * used.
         *
         * @param {Function} callback - receives parameters `err:Error, str:String`
         */
        stringify: function (value, options, callback) {
            // normalise polymorphic function to make `options` optional
            if (typeof options === FUNCTION && !callback) {
                callback = options;
                options = null;
            }

            // check whether callback is a function and otherwise unset to avoid erroneous calls
            (typeof callback !== FUNCTION) && (callback = null);

            // move up the event loop to make this asynchronous
            setTimeout(function () {
                var replacer,
                    indent,
                    str;

                // get options, if provided by user
                if (options) {
                    replacer = options.replacer;
                    indent = options.indent;
                }

                try {
                    str = JSON.stringify(value, replacer, indent);
                }
                catch (err) {
                    err.name = ERROR_NAME;
                    callback && callback(err);
                }

                callback && callback(null, str);
            }, NUM_ZERO);
        }
    }
};
