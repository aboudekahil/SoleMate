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
exports.ShoeSize = void 0;
const typeorm_1 = require("typeorm");
const shoe_entity_1 = require("./shoe.entity");
let ShoeSize = class ShoeSize {
    shoesize_id;
    shoe;
    shoe_size;
    price;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ShoeSize.prototype, "shoesize_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shoe_entity_1.Shoe, (shoe) => shoe.shoeSizes, { nullable: false }),
    __metadata("design:type", shoe_entity_1.Shoe)
], ShoeSize.prototype, "shoe", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ShoeSize.prototype, "shoe_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], ShoeSize.prototype, "price", void 0);
ShoeSize = __decorate([
    (0, typeorm_1.Entity)({ name: "shoe_sizes" })
], ShoeSize);
exports.ShoeSize = ShoeSize;
