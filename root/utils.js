module.exports = {
    lowerCaseFirst: function (str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    },
    upperCaseFirst: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}