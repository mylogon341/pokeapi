"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const Helpers_1 = require("../Helpers");
class Type {
    constructor(body) {
        this.name = Helpers_1.capitalizeFirstLetter(body.type.name);
        this.url = body.type.url;
    }
}
exports.Type = Type;
//# sourceMappingURL=types.js.map