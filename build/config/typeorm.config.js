"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("../entities/city.entity");
const feedback_entity_1 = require("../entities/feedback.entity");
const omtpayment_entity_1 = require("../entities/omtpayment.entity");
const review_entity_1 = require("../entities/review.entity");
const shoe_entity_1 = require("../entities/shoe.entity");
const shoeimage_entity_1 = require("../entities/shoeimage.entity");
const shoesize_entity_1 = require("../entities/shoesize.entity");
const user_entity_1 = require("../entities/user.entity");
const whishpayment_entity_1 = require("../entities/whishpayment.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "solemate",
    // synchronize: true,
    logging: true,
    // DO NOT RUN THIS IN PROD
    // dropSchema: true,
    entities: [
        city_entity_1.City,
        feedback_entity_1.Feedback,
        omtpayment_entity_1.OmtPayment,
        review_entity_1.Review,
        shoe_entity_1.Shoe,
        shoeimage_entity_1.ShoeImage,
        shoesize_entity_1.ShoeSize,
        user_entity_1.User,
        whishpayment_entity_1.WhishPayment,
    ],
    subscribers: [],
    migrations: [],
});
