"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const typeorm_config_1 = require("../config/typeorm.config");
const user_entity_1 = require("../enitities/user.entity");
exports.userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
