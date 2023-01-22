"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
require("../Helpers");
class Type {
    constructor(body) {
        this.name = body.type.name.capitaliseFirstLetter();
        this.url = body.type.url;
    }
}
exports.Type = Type;
//# sourceMappingURL=types.js.map