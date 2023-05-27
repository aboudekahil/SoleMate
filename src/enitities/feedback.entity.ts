import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Length } from "class-validator";

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  comment_id: string;

  @ManyToOne(() => User, (user) => user.feedbacks, { nullable: false })
  user: User;

  @Column({ nullable: false })
  @Length(1, 280)
  comment_text: string;
}
