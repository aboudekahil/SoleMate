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
exports.User = void 0;
// Users
const typeorm_1 = require("typeorm");
const city_enitity_1 = require("./city.enitity");
const class_validator_1 = require("class-validator");
const shoe_entity_1 = require("./shoe.entity");
const review_entity_1 = require("./review.entity");
const feedback_entity_1 = require("./feedback.entity");
let User = class User {
    user_id;
    name;
    family_name;
    email_address;
    payment_option;
    phone_number;
    city;
    street;
    building;
    apartment;
    is_admin;
    ownedShoes;
    reviews;
    feedbacks;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
    }),
    (0, class_validator_1.Length)(3, 30),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        nullable: false,
    }),
    (0, class_validator_1.Length)(3, 30),
    __metadata("design:type", String)
], User.prototype, "family_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email_address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["OMT", "Wish", "Both"],
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "payment_option", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    (0, class_validator_1.Length)(8, 12),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_enitity_1.City, (city) => city, { nullable: false }),
    __metadata("design:type", city_enitity_1.City)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, class_validator_1.Length)(3, 200),
    __metadata("design:type", String)
], User.prototype, "street", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, class_validator_1.Length)(3, 200),
    __metadata("design:type", String)
], User.prototype, "building", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, class_validator_1.Length)(3, 200),
    __metadata("design:type", String)
], User.prototype, "apartment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_admin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shoe_entity_1.Shoe, (shoe) => shoe.owner, { nullable: false }),
    __metadata("design:type", Array)
], User.prototype, "ownedShoes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.user, { nullable: false }),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feedback_entity_1.Feedback, (feedback) => feedback.user, { nullable: false }),
    __metadata("design:type", Array)
], User.prototype, "feedbacks", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], User);
exports.User = User;
