import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shoe } from "./shoe.entity";
import { Length } from "class-validator";

@Entity({ name: "shoe_images" })
export class ShoeImage {
  @PrimaryGeneratedColumn("uuid")
  image_id: string;

  @Column({ nullable: false })
  @Length(1)
  image_url: string;

  @Column({
    type: "enum",
    enum: [
      "Front",
      "Back",
      "Sides 1",
      "Sides 2",
      "Tag",
      "Insole",
      "Box Front",
      "Box Tag",
      "Box date",
      "Other",
    ],
    nullable: false,
  })
  image_type: ShoeImageType;

  @ManyToOne(() => Shoe, (shoe) => shoe.images)
  shoe: Shoe;
}
