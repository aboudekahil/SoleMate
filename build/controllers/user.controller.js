"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const InvalidError_1 = require("../errors/InvalidError");
const session_config_1 = require("../config/session.config");
const signup = async (req, res) => {
    try {
        const user_service = new userService_1.default();
        req.body.password = await user_service.hashPassword(req.body.password);
        const created_user = await user_service.signUserUp(req.body);
        const session = await session_config_1.user_session_handler.createSession(created_user.user_id);
        res.cookie("session_id", session.session_id, {
            httpOnly: true,
            expires: session.timeout_date,
        });
        res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        if (error instanceof InvalidError_1.InvalidError)
            res.status(403).json(JSON.parse(error.toString()));
        else
            res.status(500).json({ message: "Internal server error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const user_service = new userService_1.default();
    const found_user = await user_service.findUserByEmailAndPassword(req.body.email_address, req.body.password);
    if (!found_user) {
        res.status(403).json(JSON.parse(new InvalidError_1.InvalidError([
            {
                title: "Invalid credentials",
                message: "Email or password is incorrect",
            },
        ]).toString()));
        return;
    }
    const session = await session_config_1.user_session_handler.createSession(found_user.user_id);
    res.cookie("session_id", session.session_id, {
        httpOnly: true,
        expires: session.timeout_date,
    });
    res.status(200).json({ message: "User logged in successfully" });
};
exports.login = login;
