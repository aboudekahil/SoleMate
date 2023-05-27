import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Length } from "class-validator";

@Entity({ name: "whish_payments" })
export class WhishPayment {
  @PrimaryGeneratedColumn("uuid")
  whishpayment_id: string;

  @Column({ unique: true, nullable: false })
  @Length(1)
  value: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
