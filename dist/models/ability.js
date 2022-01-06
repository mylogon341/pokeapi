"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
require("../Helpers");
class Ability {
    constructor(data, isHidden) {
        this.is_hidden = isHidden;
        this.id = data.id;
        this.name = data.name.capitaliseFirstLetter().removeDashes();
        const flavours = data.flavor_text_entries.filter(f => f.language.name == "en");
        if (flavours.length > 0) {
            this.flavour_text = flavours[0].flavor_text.removeLinebreaks();
        }
        const entries = data.effect_entries.filter(i => i.language.name === "en");
        if (entries.length > 0) {
            this.description = entries[0].effect.removeLinebreaks();
        }
    }
}
exports.Ability = Ability;
//# sourceMappingURL=ability.js.map