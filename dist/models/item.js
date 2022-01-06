"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.BasicItem = void 0;
require("../Helpers");
const common_1 = require("./common");
const pokemon_1 = require("./pokemon");
class BasicItem {
    constructor(i) {
        this.name = i.name.removeDashes().capitaliseEachWord();
        this.id = i.url.versionNumberFromUrl();
        this.sprite_name = i.name;
    }
}
exports.BasicItem = BasicItem;
class Item {
    constructor(body) {
        this.id = body.id;
        this.name = body.name.removeDashes().capitaliseEachWord();
        this.cost = body.cost;
        this.attributes = body.attributes.map(a => common_1.NameURL.fromObj(a));
        this.baby_trigger_for = body.baby_trigger_for ? body.baby_trigger_for.url : undefined;
        this.fling_power = body.fling_power;
        this.fling_effect = common_1.NameURL.fromObj(body.fling_effect);
        this.category = common_1.NameURL.fromObj(body.category);
        this.sprite = body.sprites.default;
        const engEffectEntry = body
            .effect_entries
            .filter(e => e.language.name == "en");
        if (engEffectEntry.length > 0) {
            const entry = engEffectEntry[0];
            this.effect_description = { short: entry.short_effect, full: entry.effect.removeLinebreaks() };
        }
        this.flavour_text_entries = body
            .flavor_text_entries
            .filter(e => e.language.name == "en")
            .map(e => {
            return { group: e.version_group.name.removeDashes(), entry: e.text.removeLinebreaks() };
        });
        this.held_by_pokemon = body
            .held_by_pokemon
            .map(d => new pokemon_1.BasicPokemon(d.pokemon));
    }
}
exports.Item = Item;
//# sourceMappingURL=item.js.map