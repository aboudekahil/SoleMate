import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Length } from "class-validator";
import { ShoeSize } from "./shoesize.entity";
import { User } from "./user.entity";
import { Review } from "./review.entity";
import { ShoeImage } from "./shoeimage.entity";

@Entity()
export class Shoe {
  @PrimaryGeneratedColumn("uuid")
  shoe_id: string;

  @Column({ nullable: false })
  @Length(3, 100)
  name: string;

  @Column({
    type: "enum",
    enum: ["New", "Barely worn", "Worn"],
    nullable: false,
  })
  condition: ShoeCondition;

  @Column({
    type: "enum",
    enum: ["Original", "None"],
    nullable: false,
  })
  @Column({ nullable: false })
  color: string;

  @OneToMany(() => ShoeImage, (image) => image.shoe, { nullable: false })
  images: ShoeImage[];

  @ManyToOne(() => User, (user) => user.ownedShoes, { nullable: false })
  owner: User;

  @OneToMany(() => ShoeSize, (shoeSize) => shoeSize.shoe, { nullable: false })
  shoeSizes: ShoeSize[];

  @OneToMany(() => Review, (review) => review.shoe)
  reviews: Review[];
}
