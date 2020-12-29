"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionNumberFromUrl = exports.capitalizeFirstLetter = void 0;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function versionNumberFromUrl(url) {
    const splits = url.split("/");
    return Number(splits[splits.length - 2]);
}
exports.versionNumberFromUrl = versionNumberFromUrl;
//# sourceMappingURL=Helpers.js.map