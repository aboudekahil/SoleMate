import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Length } from "class-validator";

@Entity({ name: "cities" })
export class City {
  @PrimaryGeneratedColumn("uuid")
  city_id: string;

  @Column({ unique: true, nullable: false })
  @Length(3)
  name: string;

  @OneToMany(() => User, (user) => user.city)
  users: User[];
}
