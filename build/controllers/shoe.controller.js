"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShoe = exports.multerErrorHandlerMiddleware = exports.getShoes = void 0;
const session_config_1 = require("../config/session.config");
const prisma_config_1 = require("../config/prisma.config");
const http2_1 = require("http2");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
const class_validator_1 = require("class-validator");
const path_1 = __importDefault(require("path"));
async function getShoes(req, res) {
    console.log(process.env.SEX);
    const shoes = await prisma_config_1.prisma.shoes.findMany({
        where: {
            orders: {
                none: {},
            },
        },
        include: {
            shoe_images: {
                select: {
                    image_url: true,
                    image_type: true,
                },
            },
            shoe_sizes: {
                select: {
                    shoe_size: true,
                    price: true,
                    quantity: true,
                },
            },
            users: {
                select: {
                    name: true,
                    family_name: true,
                },
            },
        },
    });
    res.status(http2_1.constants.HTTP_STATUS_OK).json(shoes);
}
exports.getShoes = getShoes;
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
            else {
                next();
            }
        });
    };
}
exports.multerErrorHandlerMiddleware = multerErrorHandlerMiddleware;
async function addShoe(req, res) {
    let { name, condition, color, sizes, fit } = req.body;
    const { session_id } = req.cookies;
    const user_session = await session_config_1.user_session_handler.getSession(session_id);
    if (!user_session) {
        res.status(http2_1.constants.HTTP_STATUS_UNAUTHORIZED).json({
            title: "Unauthorized",
            message: "You are not logged in",
        });
        return;
    }
    if (!(0, class_validator_1.isEnum)(condition, client_1.shoes_condition)) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid condition",
        });
        return;
    }
    if (!(0, class_validator_1.isEnum)(fit, client_1.shoe_fit)) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid fit",
        });
        return;
    }
    if (!name || !color || !sizes) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid input",
        });
        return;
    }
    const sizesJSON = JSON.parse(sizes);
    if (!Array.isArray(sizesJSON)) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({
            title: "Bad request",
            message: "Invalid sizes",
        });
        return;
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
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.front[0].path))}/${path_1.default.basename(files.front[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Back,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.back[0].path))}/${path_1.default.basename(files.back[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Sides_1,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.sides1[0].path))}/${path_1.default.basename(files.sides1[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Sides_2,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.sides2[0].path))}/${path_1.default.basename(files.sides2[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Tag,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.tag[0].path))}/${path_1.default.basename(files.tag[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Insole,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.insole[0].path))}/${path_1.default.basename(files.insole[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_Front,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.box_front[0].path))}/${path_1.default.basename(files.box_front[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_Tag,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.box_tag[0].path))}/${path_1.default.basename(files.box_tag[0].path)}`,
            },
            {
                image_type: client_1.shoe_images_image_type.Box_date,
                image_url: `/static/${path_1.default.basename(path_1.default.dirname(files.box_date[0].path))}/${path_1.default.basename(files.box_date[0].path)}`,
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
                fit,
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
