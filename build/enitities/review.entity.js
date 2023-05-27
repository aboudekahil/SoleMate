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
exports.Review = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const shoe_entity_1 = require("./shoe.entity");
const class_validator_1 = require("class-validator");
let Review = class Review {
    review_id;
    user;
    shoe;
    customer_service_rating;
    shipping_time_rating;
    shipping_quality_rating;
    website_performance_rating;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Review.prototype, "review_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reviews, { nullable: false }),
    __metadata("design:type", user_entity_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shoe_entity_1.Shoe, (shoes) => shoes.reviews, { nullable: false }),
    __metadata("design:type", shoe_entity_1.Shoe)
], Review.prototype, "shoe", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: false }),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Review.prototype, "customer_service_rating", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: false }),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Review.prototype, "shipping_time_rating", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: false }),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Review.prototype, "shipping_quality_rating", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: false }),
    (0, class_validator_1.Max)(5),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Review.prototype, "website_performance_rating", void 0);
Review = __decorate([
    (0, typeorm_1.Entity)({ name: "reviews" })
], Review);
exports.Review = Review;
