import { InvalidError } from "../errors/InvalidError";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.config";

export default class {
  constructor() {}

  signUserUp = async ({
    apartment,
    building,
    city,
    email_address,
    family_name,
    name,
    password,
    payment_option,
    payment_values: { OMT, Whish },
    phone_number,
    street,
  }: UserCreateBody) => {
    const found_city = await prisma.cities.findUnique({
      where: {
        name: city,
      },
    });

    if (!found_city) {
      throw new InvalidError([
        {
          title: "Invalid city",
          message: "City does not exist",
        },
      ]);
    }
    return prisma.users.create({
      data: {
        name,
        family_name,
        password,
        email_address,
        phone_number,
        street,
        apartment,
        building,
        payment_option,
        city_id: found_city.city_id,
        whish_payment: Whish
          ? {
              create: {
                value: Whish,
              },
            }
          : undefined,
        omt_payment: OMT
          ? {
              create: {
                value: OMT,
              },
            }
          : undefined,
      },
    });
  };

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 15);
  }

  async comparePassword(password: string, hashed_password: string) {
    return await bcrypt.compare(password, hashed_password);
  }

  async findUserByEmailAndPassword(email_address: string, password: string) {
    const found_user = await prisma.users.findUnique({
      where: {
        email_address,
      },
    });

    if (!found_user) {
      return null;
    }

    const is_password_valid = await this.comparePassword(
      password,
      found_user.password
    );

    if (!is_password_valid) {
      return null;
    }

    return found_user;
  }
}
