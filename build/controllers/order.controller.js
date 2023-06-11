"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = void 0;
const http2_1 = require("http2");
const session_config_1 = require("../configs/session.config");
const prisma_config_1 = require("../configs/prisma.config");
const library_1 = require("@prisma/client/runtime/library");
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
async function placeOrder(req, res) {
    const { shoe_id } = req.body;
    const session_id = req.cookies.session_id;
    if (!session_id) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, ERROR_REASON.NOT_LOGGED_IN);
        return;
    }
    const user_session = await session_config_1.user_session_handler.getSession(session_id);
    if (!user_session) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, ERROR_REASON.NOT_LOGGED_IN);
        return;
    }
    let order;
    try {
        order = await prisma_config_1.prisma.orders.create({
            data: {
                user: {
                    connect: {
                        user_id: user_session.user_id,
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
                (0, httpErrorHandling_1.handleBadRequest)(res, "Shoe provided is not valid");
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
