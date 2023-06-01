"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const InvalidError_1 = require("../errors/InvalidError");
const session_config_1 = require("../config/session.config");
const http2_1 = require("http2");
// {
//   "apartment": "123",
//     "building": "456",
//     "city": "Tyr",
//     "email_address": "aboudehkahil@gmail.com",
//     "family_name": "kahil",
//     "name": "abd el kader kahil",
//     "password": "aboudeh2004",
//     "payment_option": "Whish",
//     "payment_values": {
//   "OMT": null,
//       "Whish": "123456789"
// },
//   "phone_number": "71493037",
//     "street": "Bayak"
// }
async function signup(req, res) {
    try {
        const user_service = new userService_1.default();
        req.body.password = await user_service.hashPassword(req.body.password);
        const created_user = await user_service.signUserUp(req.body);
        const session = await session_config_1.user_session_handler.createSession(created_user.user_id);
        res.cookie("session_id", session.session_id, {
            httpOnly: true,
            expires: session.timeout_date,
            secure: true,
        });
        res
            .status(http2_1.constants.HTTP_STATUS_CREATED)
            .json({ message: "User created successfully" });
    }
    catch (error) {
        if (error instanceof InvalidError_1.InvalidError)
            res
                .status(http2_1.constants.HTTP_STATUS_FORBIDDEN)
                .json(JSON.parse(error.toString()));
        else
            res
                .status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
    }
}
exports.signup = signup;
async function login(req, res) {
    const user_service = new userService_1.default();
    const found_user = await user_service.findUserByEmailAndPassword(req.body.email_address, req.body.password);
    if (!found_user) {
        res.status(http2_1.constants.HTTP_STATUS_UNAUTHORIZED).json({
            title: "Invalid credentials",
            message: "Email or password is incorrect",
        });
        return;
    }
    const session = await session_config_1.user_session_handler.createSession(found_user.user_id);
    res.cookie("session_id", session.session_id, {
        httpOnly: true,
        expires: session.timeout_date,
    });
    res
        .status(http2_1.constants.HTTP_STATUS_OK)
        .json({ message: "User logged in successfully" });
}
exports.login = login;
