import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Shoe } from "./shoe.entity";
import { IsInt, Max, Min } from "class-validator";

@Entity({ name: "reviews" })
export class Review {
  @PrimaryGeneratedColumn("uuid")
  review_id: string;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
  user: User;

  @ManyToOne(() => Shoe, (shoes) => shoes.reviews, { nullable: false })
  shoe: Shoe;

  @Column("int", { nullable: false })
  @Max(5)
  @Min(0)
  @IsInt()
  customer_service_rating: number;

  @Column("int", { nullable: false })
  @Max(5)
  @Min(0)
  @IsInt()
  shipping_time_rating: number;

  @Column("int", { nullable: false })
  @Max(5)
  @Min(0)
  @IsInt()
  shipping_quality_rating: number;

  @Column("int", { nullable: false })
  @Max(5)
  @Min(0)
  @IsInt()
  website_performance_rating: number;
}
