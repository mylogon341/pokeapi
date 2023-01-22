"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameURL = void 0;
require("../Helpers");
class NameURL {
    constructor(name, url) {
        this.name = name.capitaliseFirstLetter().removeDashes();
        this.url = url;
    }
    static fromObj(obj) {
        return obj ? new NameURL(obj.name, obj.url) : undefined;
    }
}
exports.NameURL = NameURL;
//# sourceMappingURL=common.js.map