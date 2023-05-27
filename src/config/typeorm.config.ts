import { DataSource } from "typeorm";
import { City } from "../enitities/city.enitity";
import { Feedback } from "../enitities/feedback.entity";
import { OmtPayment } from "../enitities/omtpayment.entity";
import { Review } from "../enitities/review.entity";
import { Shoe } from "../enitities/shoe.entity";
import { ShoeImage } from "../enitities/shoeimage.entity";
import { ShoeSize } from "../enitities/shoesize.entity";
import { User } from "../enitities/user.entity";
import { WhishPayment } from "../enitities/whishpayment.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "solemate",
  synchronize: true,
  logging: true,
  // DO NOT RUN THIS IN PROD
  dropSchema: true,
  entities: [
    City,
    Feedback,
    OmtPayment,
    Review,
    Shoe,
    ShoeImage,
    ShoeSize,
    User,
    WhishPayment,
  ],
  subscribers: [],
  migrations: [],
});
