"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShoe = exports.multerErrorHandlerMiddleware = void 0;
const session_config_1 = require("../config/session.config");
const prisma_config_1 = require("../config/prisma.config");
const http2_1 = require("http2");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
function multerErrorHandlerMiddleware(upload) {
    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer_1.MulterError) {
                res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
                    title: "Bad request",
                    message: err.message,
                });
            }
            else if (err) {
                res
                    .status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
                    .send(err + "Upload failed due to unknown error");
            }
            next();
        });
    };
}
exports.multerErrorHandlerMiddleware = multerErrorHandlerMiddleware;
async function addShoe(req, res) {
    let { name, condition, color, sizes } = req.body;
    if (!(condition in client_1.shoes_condition)) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid condition",
        });
        return;
    }
    if (!name || !color || !sizes) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid input",
        });
    }
    const sizesJSON = JSON.parse(sizes);
    if (!Array.isArray(sizesJSON)) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid sizes",
        });
    }
    for (const size of sizesJSON) {
        if (size.price <= 0 || size.quantity <= 0 || size.size <= 0) {
            res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
                title: "Bad request",
                message: "Invalid sizes input",
            });
            return;
        }
    }
    const files = req.files;
    if (!files) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "No files were uploaded",
        });
        return;
    }
    const { session_id } = req.cookies;
    const user_session = await session_config_1.user_session_handler.getSession(session_id);
    if (!user_session) {
        res.status(http2_1.constants.HTTP_STATUS_UNAUTHORIZED).json({
            title: "Unauthorized",
            message: "You are not logged in",
        });
        return;
    }
    if (files.front &&
        files.back &&
        files.sides1 &&
        files.sides2 &&
        files.tag &&
        files.insole &&
        files.box_front &&
        files.box_tag &&
        files.box_date) {
        const shoeImages = [
            {
                image_type: client_1.shoe_images_image_type.Front,
                image_url: files.front[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Back,
                image_url: files.back[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Sides_1,
                image_url: files.sides1[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Sides_2,
                image_url: files.sides2[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Tag,
                image_url: files.tag[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Insole,
                image_url: files.insole[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_Front,
                image_url: files.box_front[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_Tag,
                image_url: files.box_tag[0].path,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_date,
                image_url: files.box_date[0].path,
            },
        ];
        if (files.other) {
            files.other = files.other;
            shoeImages.push(...files.other.map((image) => ({
                image_type: client_1.shoe_images_image_type.Other,
                image_url: image.path,
            })));
        }
        const shoe = await prisma_config_1.prisma.shoes.create({
            data: {
                name,
                condition,
                color,
                shoe_sizes: {
                    create: sizesJSON.map((size) => ({
                        shoe_size: size.size,
                        price: size.price,
                        quantity: size.quantity,
                    })),
                },
                users: {
                    connect: {
                        user_id: user_session.user_id,
                    },
                },
                shoe_images: {
                    create: shoeImages,
                },
            },
        });
        await res.status(http2_1.constants.HTTP_STATUS_CREATED).json(shoe);
    }
    else {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad Request",
            message: "Missing images",
        });
    }
}
exports.addShoe = addShoe;
