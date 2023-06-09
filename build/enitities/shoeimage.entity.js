"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoeImage = void 0;
const typeorm_1 = require("typeorm");
const shoe_entity_1 = require("./shoe.entity");
const class_validator_1 = require("class-validator");
let ShoeImage = class ShoeImage {
    image_id;
    image_url;
    image_type;
    shoe;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ShoeImage.prototype, "image_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, class_validator_1.Length)(1),
    __metadata("design:type", String)
], ShoeImage.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: [
            "Front",
            "Back",
            "Sides 1",
            "Sides 2",
            "Tag",
            "Insole",
            "Box Front",
            "Box Tag",
            "Box date",
            "Other",
        ],
        nullable: false,
    }),
    __metadata("design:type", String)
], ShoeImage.prototype, "image_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shoe_entity_1.Shoe, (shoe) => shoe.images),
    __metadata("design:type", shoe_entity_1.Shoe)
], ShoeImage.prototype, "shoe", void 0);
ShoeImage = __decorate([
    (0, typeorm_1.Entity)({ name: "shoe_images" })
], ShoeImage);
exports.ShoeImage = ShoeImage;
