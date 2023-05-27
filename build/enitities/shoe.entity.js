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
exports.Shoe = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const shoesize_entity_1 = require("./shoesize.entity");
const user_entity_1 = require("./user.entity");
const review_entity_1 = require("./review.entity");
const shoeimage_entity_1 = require("./shoeimage.entity");
let Shoe = class Shoe {
    shoe_id;
    name;
    condition;
    color;
    images;
    owner;
    shoeSizes;
    reviews;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Shoe.prototype, "shoe_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], Shoe.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["New", "Barely worn", "Worn"],
        nullable: false,
    }),
    __metadata("design:type", String)
], Shoe.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["Original", "None"],
        nullable: false,
    }),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Shoe.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shoeimage_entity_1.ShoeImage, (image) => image.shoe, { nullable: false }),
    __metadata("design:type", Array)
], Shoe.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ownedShoes, { nullable: false }),
    __metadata("design:type", user_entity_1.User)
], Shoe.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shoesize_entity_1.ShoeSize, (shoeSize) => shoeSize.shoe, { nullable: false }),
    __metadata("design:type", Array)
], Shoe.prototype, "shoeSizes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.shoe),
    __metadata("design:type", Array)
], Shoe.prototype, "reviews", void 0);
Shoe = __decorate([
    (0, typeorm_1.Entity)()
], Shoe);
exports.Shoe = Shoe;
