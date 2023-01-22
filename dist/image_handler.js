"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.ImageSource = void 0;
/* eslint-disable no-case-declarations */
const path_1 = require("path");
const fs_1 = require("fs");
const requests_1 = require("./requests");
var ImageSource;
(function (ImageSource) {
    ImageSource[ImageSource["poke_image"] = 0] = "poke_image";
    ImageSource[ImageSource["poke_sprite"] = 1] = "poke_sprite";
    ImageSource[ImageSource["item_sprite"] = 2] = "item_sprite";
})(ImageSource = exports.ImageSource || (exports.ImageSource = {}));
function getImage(type, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const nothing = '../node_modules/pokemon-sprites/sprites/items/poke-ball.png';
        let resolvePath = "";
        switch (type) {
            case ImageSource.poke_image:
                const poke = yield (0, requests_1.pokemon)(index);
                const sprite = poke
                    .base
                    .sprite
                    .groups
                    .filter(m => m.name == "OTHER")[0]
                    .sprite_groups
                    .filter(m => m.group_name == "Official Artwork")[0]
                    .sprites[0];
                if (sprite != undefined) {
                    const path = sprite.url.imageUrlToPath();
                    resolvePath = "../node_modules/pokemon-sprites" + path;
                }
                break;
            case ImageSource.poke_sprite:
                resolvePath = `../node_modules/pokemon-sprites/sprites/pokemon/${index}.png`;
                break;
            case ImageSource.item_sprite:
                break;
        }
        if (resolvePath != "" && (0, fs_1.existsSync)(resolvePath)) {
            return (0, path_1.resolve)(resolvePath);
        }
        else {
            return (0, path_1.resolve)(nothing);
        }
    });
}
exports.getImage = getImage;
//# sourceMappingURL=image_handler.js.map