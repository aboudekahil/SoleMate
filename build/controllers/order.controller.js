"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = void 0;
const http2_1 = require("http2");
const session_config_1 = require("../config/session.config");
const prisma_config_1 = require("../config/prisma.config");
const library_1 = require("@prisma/client/runtime/library");
async function placeOrder(req, res) {
    const { shoe_id } = req.body;
    debugger;
    if (!req.cookies.session_id) {
        res.status(http2_1.constants.HTTP_STATUS_UNAUTHORIZED).json({
            title: "Unauthorized request",
            message: "User not logged in",
        });
    }
    const { session_id } = req.cookies;
    const user = await session_config_1.user_session_handler.getSession(session_id);
    if (!user) {
        res.status(http2_1.constants.HTTP_STATUS_UNAUTHORIZED).json({
            title: "Unauthorized request",
            message: "Invalid session_id cookie",
        });
        return;
    }
    let order;
    try {
        order = await prisma_config_1.prisma.orders.create({
            data: {
                user: {
                    connect: {
                        user_id: user.user_id,
                    },
                },
                shoe: {
                    connect: {
                        shoe_id,
                    },
                },
            },
        });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                console.log(error.cause);
                res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
                    title: "Bad request",
                    message: "Invalid shoe_id",
                });
            }
        }
        else {
            res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                title: "Internal server error",
                message: "Failed to place order",
            });
        }
        return;
    }
    res.status(http2_1.constants.HTTP_STATUS_CREATED).json({
        title: "Order placed",
        message: "Order placed successfully",
        order: order,
    });
}
exports.placeOrder = placeOrder;
