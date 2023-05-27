import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Length } from "class-validator";

@Entity({ name: "feedbacks" })
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  feedback_id: string;

  @ManyToOne(() => User, (user) => user.feedbacks, { nullable: false })
  user: User;

  @Column({ nullable: false })
  @Length(1, 280)
  content: string;
}
