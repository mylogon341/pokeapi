"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
require("../Helpers");
class Stats {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(data) {
        this.name = data.stat.name.capitaliseFirstLetter();
        this.value = data.base_stat;
    }
}
exports.Stats = Stats;
//# sourceMappingURL=stats.js.map