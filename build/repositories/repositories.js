"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whishRepository = exports.omtRepository = exports.cityRepository = exports.userRepository = void 0;
const typeorm_config_1 = require("../config/typeorm.config");
const user_entity_1 = require("../entities/user.entity");
const city_entity_1 = require("../entities/city.entity");
const omtpayment_entity_1 = require("../entities/omtpayment.entity");
const whishpayment_entity_1 = require("../entities/whishpayment.entity");
exports.userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
exports.cityRepository = typeorm_config_1.AppDataSource.getRepository(city_entity_1.City);
exports.omtRepository = typeorm_config_1.AppDataSource.getRepository(omtpayment_entity_1.OmtPayment);
exports.whishRepository = typeorm_config_1.AppDataSource.getRepository(whishpayment_entity_1.WhishPayment);
