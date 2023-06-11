"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const session_config_1 = require("../configs/session.config");
const http2_1 = require("http2");
const class_validator_1 = require("class-validator");
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
const prisma_config_1 = require("../configs/prisma.config");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function signup(req, res) {
    const { apartment, building, city, email_address, family_name, name, password, payment_option, payment_values: { OMT, Whish }, phone_number, street, } = req.body;
    if (!(0, class_validator_1.isPhoneNumber)(phone_number, "LB")) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Phone number is not valid");
        return;
    }
    if ((payment_option === "Whish" && !Whish) ||
        (payment_option === "OMT" && !OMT)) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Payment values do not match payment option");
        return;
    }
    req.body.password = await bcrypt_1.default.hash(password, 15);
    const found_city = await prisma_config_1.prisma.cities.findUnique({
        where: {
            name: city,
        },
    });
    if (!found_city) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "City is not valid");
        return;
    }
    const created_user = await prisma_config_1.prisma.users.create({
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
    const session = await session_config_1.user_session_handler.createSession(created_user.user_id);
    res.cookie("session_id", session.session_id, {
        httpOnly: true,
        expires: session.timeout_date,
        secure: process.env.IS_PROD === "TRUE",
    });
    res
        .status(http2_1.constants.HTTP_STATUS_CREATED)
        .json({ message: "User created successfully" });
}
exports.signup = signup;
async function login(req, res) {
    const found_user = await prisma_config_1.prisma.users.findUnique({
        where: {
            email_address: req.body.email_address,
        },
    });
    if (!found_user) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, "Email not found");
        return;
    }
    const is_password_valid = await bcrypt_1.default.compare(req.body.password, found_user.password);
    if (!is_password_valid) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, "Email or password is incorrect");
        return;
    }
    const session = await session_config_1.user_session_handler.createSession(found_user.user_id);
    res.cookie("session_id", session.session_id, {
        httpOnly: true,
        expires: session.timeout_date,
        secure: process.env.IS_PROD === "TRUE",
    });
    res
        .status(http2_1.constants.HTTP_STATUS_OK)
        .json({ message: "User logged in successfully" });
}
exports.login = login;
async function logout(req, res) {
    const session_id = req.cookies.session_id;
    if (!session_id) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad Request",
            message: "Session id is not provided",
        });
        return;
    }
    await session_config_1.user_session_handler.deleteSession(session_id);
    res.clearCookie("session_id");
    res
        .status(http2_1.constants.HTTP_STATUS_OK)
        .json({ message: "User logged out successfully" });
}
exports.logout = logout;
