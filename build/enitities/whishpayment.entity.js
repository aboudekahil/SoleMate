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
exports.WhishPayment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const class_validator_1 = require("class-validator");
let WhishPayment = class WhishPayment {
    whishpayment_id;
    value;
    user;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], WhishPayment.prototype, "whishpayment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    (0, class_validator_1.Length)(1),
    __metadata("design:type", String)
], WhishPayment.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], WhishPayment.prototype, "user", void 0);
WhishPayment = __decorate([
    (0, typeorm_1.Entity)({ name: "whish_payments" })
], WhishPayment);
exports.WhishPayment = WhishPayment;
