import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Length } from "class-validator";

@Entity()
export class OmtPayment {
  @PrimaryGeneratedColumn("uuid")
  omt_payment: string;

  @Column({ unique: true, nullable: false })
  @Length(1)
  value: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
