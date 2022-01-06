String.prototype.capitaliseFirstLetter = function () {
    return this.charAt(0)
        .toUpperCase() + this.slice(1);
};
String.prototype.capitaliseEachWord = function () {
    return this.split(" ")
        .map(w => w.capitaliseFirstLetter())
        .join(" ");
};
String.prototype.versionNumberFromUrl = function () {
    const splits = this.split("/");
    return Number(splits[splits.length - 2]);
};
String.prototype.camelToPresentation = function () {
    return this.replace(/_/g, " ");
};
String.prototype.removeDashes = function () {
    return this.replace(/-/g, " ");
};
String.prototype.removeLinebreaks = function () {
    return this
        .replace(/\n/g, " ")
        .replace(/\f/g, " ");
};
String.prototype.imageUrlToPath = function () {
    return this.split("https://raw.githubusercontent.com/PokeAPI/sprites/master")[1];
};
//# sourceMappingURL=Helpers.js.map