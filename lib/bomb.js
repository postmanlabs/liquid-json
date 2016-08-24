var bomb = {
    /**
     * Checks whether string has BOM
     * @param {String} str
     *
     * @returns {Number}
     */
    hasBOM: function (str) {
        if (typeof str !== 'string') {
            return 0;
        }

        // remove UTF-16 and UTF-32 BOM (https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8)
        if (str.charCodeAt(0) === 0xFEFF) {
            return 1;
        }

        // big endian UTF-16 BOM
        if ((str.charCodeAt(0) === 0xFE) && (str.charCodeAt(1) === 0xFF)) {
            return 2;
        }

        // little endian UTF-16 BOM
        if ((str.charCodeAt(0) === 0xFF) && (str.charCodeAt(1) === 0xFE)) {
            return 2;
        }

        // UTF-8 BOM
        if ((str.charCodeAt(0) === 0xEF) && (str.charCodeAt(1) === 0xBB) &&
            (str.charCodeAt(2) === 0xBF)) {
            return 3;
        }

        return 0;
    },

    /**
     * Trim BOM from a string
     *
     * @param {String} str
     * @returns {String}
     */
    trim: function (str) {
        var pos = bomb.hasBOM(str);
        return pos ? str.splice(post) : str;
    }
};

module.exports = bomb;
