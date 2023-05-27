import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shoe } from "./shoe.entity";

@Entity({ name: "shoe_sizes" })
export class ShoeSize {
  @PrimaryGeneratedColumn("uuid")
  shoesize_id: string;

  @ManyToOne(() => Shoe, (shoe) => shoe.shoeSizes, { nullable: false })
  shoe: Shoe;

  @Column({ nullable: false })
  shoe_size: number;

  @Column({ nullable: false })
  price: number;
}
