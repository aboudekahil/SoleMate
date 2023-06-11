"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = exports.sendReview = void 0;
const http2_1 = require("http2");
const prisma_config_1 = require("../configs/prisma.config");
const session_config_1 = require("../configs/session.config");
const httpErrorHandling_1 = require("../errors/httpErrorHandling");
async function sendReview(req, res) {
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
    const user = (await prisma_config_1.prisma.users.findUnique({
        where: {
            user_id: user_session.user_id,
        },
    }));
    if (!user.is_verified) {
        (0, httpErrorHandling_1.handleUnauthorizedRequest)(res, ERROR_REASON.UNVERIFIED_ACCOUNT);
        return;
    }
    const { customer_service_rating, shipping_time_rating, shipping_quality_rating, website_performance_rating, shoe_id, } = req.body;
    const shoe = await prisma_config_1.prisma.shoes.findUnique({
        where: {
            shoe_id: shoe_id,
        },
    });
    if (!shoe) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Shoe provided is not valid");
        return;
    }
    const shipment = await prisma_config_1.prisma.orders.findFirst({
        where: {
            user_id: user_session.user_id,
            shoe_id: shoe_id,
        },
    });
    if (!shipment) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Shoe not shipped yet");
        return;
    }
    await prisma_config_1.prisma.reviews.create({
        data: {
            customer_service_rating: customer_service_rating,
            shipping_time_rating: shipping_time_rating,
            shipping_quality_rating: shipping_quality_rating,
            website_performance_rating: website_performance_rating,
            shoe_id: shoe_id,
            user_id: user_session.user_id,
        },
    });
    res.status(http2_1.constants.HTTP_STATUS_CREATED).json({
        title: "Review sent",
        message: "Review sent successfully",
    });
}
exports.sendReview = sendReview;
async function getReviews(req, res) {
    const shoe_id = req.query.shoe_id;
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
    if (!shoe_id) {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Shoe id not provided");
        return;
    }
    if (typeof shoe_id !== "string") {
        (0, httpErrorHandling_1.handleBadRequest)(res, "Shoe id must be a string");
        return;
    }
    const reviews = await prisma_config_1.prisma.reviews.findMany({
        where: {
            shoe_id: shoe_id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    family_name: true,
                    email_address: true,
                    user_id: true,
                },
            },
            shoe: {
                select: {
                    name: true,
                    shoe_id: true,
                },
            },
        },
    });
    res.status(http2_1.constants.HTTP_STATUS_OK).json({
        title: "Reviews",
        message: "Reviews retrieved successfully",
        data: reviews,
    });
}
exports.getReviews = getReviews;
