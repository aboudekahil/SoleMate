"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFeedback = exports.getFeedbacks = void 0;
const http2_1 = require("http2");
const prisma_config_1 = require("../configs/prisma.config");
const session_config_1 = require("../configs/session.config");
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
async function getFeedbacks(req, res) {
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
    const user = await prisma_config_1.prisma.users.findUnique({
        where: {
            user_id: user_session.user_id,
        },
    });
    if (!user?.is_admin) {
        (0, httpErrorHandling_1.handleForbiddenRequest)(res, ERROR_REASON.NOT_ADMIN);
        return;
    }
    const feedbacks = await prisma_config_1.prisma.feedbacks.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            content: true,
            createdAt: true,
            users: {
                select: {
                    name: true,
                    family_name: true,
                    email_address: true,
                },
            },
        },
    });
    res.status(http2_1.constants.HTTP_STATUS_OK).json({
        title: "Feedbacks",
        message: "Feedbacks retrieved successfully",
        data: feedbacks,
    });
}
exports.getFeedbacks = getFeedbacks;
async function sendFeedback(req, res) {
    const { content } = req.body;
    const { session_id } = req.cookies;
    const user = await session_config_1.user_session_handler.getSession(session_id);
    if (!user) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, ERROR_REASON.NOT_LOGGED_IN);
        return;
    }
    if (!content || content.length < 5) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Content must be at least 5 characters long");
        return;
    }
    await prisma_config_1.prisma.feedbacks.create({
        data: {
            content,
            user_id: user.user_id,
        },
    });
    res.status(http2_1.constants.HTTP_STATUS_CREATED).json({
        title: "Feedback sent",
        message: "Feedback sent successfully",
    });
}
exports.sendFeedback = sendFeedback;
