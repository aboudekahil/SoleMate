import { AppDataSource } from "../config/typeorm.config";
import { User } from "../enitities/user.entity";

export const userRepository = AppDataSource.getRepository(User);