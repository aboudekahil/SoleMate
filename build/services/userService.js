"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = require("../errors/InvalidError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_config_1 = require("../config/prisma.config");
class default_1 {
    constructor() { }
    signUserUp = async ({ apartment, building, city, email_address, family_name, name, password, payment_option, payment_values: { OMT, Whish }, phone_number, street, }) => {
        const found_city = await prisma_config_1.prisma.cities.findUnique({
            where: {
                name: city,
            },
        });
        if (!found_city) {
            throw new InvalidError_1.InvalidError([
                {
                    title: "Invalid city",
                    message: "City does not exist",
                },
            ]);
        }
        return prisma_config_1.prisma.users.create({
            data: {
                name,
                family_name,
                password,
                email_address,
                phone_number,
                street,
                apartment,
                building,
                payment_option,
                city_id: found_city.city_id,
                whish_payment: Whish
                    ? {
                        create: {
                            value: Whish,
                        },
                    }
                    : undefined,
                omt_payment: OMT
                    ? {
                        create: {
                            value: OMT,
                        },
                    }
                    : undefined,
            },
        });
    };
    async hashPassword(password) {
        return await bcrypt_1.default.hash(password, 15);
    }
    async comparePassword(password, hashed_password) {
        return await bcrypt_1.default.compare(password, hashed_password);
    }
    async findUserByEmailAndPassword(email_address, password) {
        const found_user = await prisma_config_1.prisma.users.findUnique({
            where: {
                email_address,
            },
        });
        if (!found_user) {
            return null;
        }
        const is_password_valid = await this.comparePassword(password, found_user.password);
        if (!is_password_valid) {
            return null;
        }
        return found_user;
    }
}
exports.default = default_1;
