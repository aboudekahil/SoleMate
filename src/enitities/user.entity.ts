// Users
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./city.enitity";
import { IsEmail, Length } from "class-validator";
import { Shoe } from "./shoe.entity";
import { Review } from "./review.entity";
import { Feedback } from "./feedback.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({
    nullable: false,
  })
  @Length(3, 30)
  name: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  @Length(3, 30)
  family_name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email_address: string;

  @Column({
    type: "enum",
    enum: ["OMT", "Wish", "Both"],
    nullable: false,
  })
  payment_option: PaymentType;

  @Column({ unique: true, nullable: false })
  @Length(8, 12)
  phone_number: string;

  @ManyToOne(() => City, (city) => city, { nullable: false })
  city: City;

  @Column({ nullable: false })
  @Length(3, 200)
  street: string;

  @Column({ nullable: false })
  @Length(3, 200)
  building: string;

  @Column({ nullable: false })
  @Length(3, 200)
  apartment: string;

  @Column({ nullable: false })
  is_admin: boolean;

  @OneToMany(() => Shoe, (shoe) => shoe.owner, { nullable: false })
  ownedShoes: Shoe[];

  @OneToMany(() => Review, (review) => review.user, { nullable: false })
  reviews: Review[];

  @OneToMany(() => Feedback, (feedback) => feedback.user, { nullable: false })
  feedbacks: Feedback[];
}
