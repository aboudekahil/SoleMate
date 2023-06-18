import { Request, Response } from "express";
import { user_session_handler } from "../configs/session.config";
import { prisma } from "../configs/prisma.config";
import { constants } from "http2";
import { shoe_images_image_type, users } from "@prisma/client";
import path from "path";
import {
  handleBadRequest,
  handleNotFoundRequest,
  handleUnauthorizedRequest,
} from "../errors/httpErrorHandling";
import { ShoeCreateBody } from "../schemas/shoe.schema";

export async function getShoe(req: Request, res: Response) {
  const id = req.params.id;

  const shoe = await prisma.shoes.findUnique({
    where: {
      shoe_id: id,
    },
    include: {
      shoe_images: {
        select: {
          image_url: true,
          image_type: true,
        },
      },
      shoe_sizes: {
        select: {
          shoe_size: true,
          price: true,
          quantity: true,
        },
      },
    },
  });

  if (!shoe) {
    handleNotFoundRequest(res, "Shoe not found");
    return;
  }

  res.status(constants.HTTP_STATUS_OK).json(shoe);
}

export async function getShoes(req: Request, res: Response) {
  const LIMIT = 30;
  const { page: rawPage = "1", sortBy, name, condition, color } = req.query;
  debugger;
  const parsedPage = parseInt(rawPage as string, 10);
  if (isNaN(parsedPage) || parsedPage < 1) {
    return res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .json({ error: "Invalid page parameter" });
  }

  const offset = (parsedPage - 1) * LIMIT;

  const orderBy: Record<string, "asc" | "desc"> = {};
  if (sortBy) {
    orderBy[String(sortBy)] = "asc";
  }

  const where: any = {
    orders: {
      none: {},
    },
    verified: process.env.IS_PROD === "TRUE" ? true : undefined,
  };

  if (name) {
    where.name = {
      contains: name.toString(),
      // mode: "insensitive",
    };
  }

  if (condition) {
    where.condition = condition.toString();
  }

  if (color) {
    where.color = color.toString();
  }

  const shoes = await prisma.shoes.findMany({
    where,
    include: {
      shoe_images: {
        select: {
          image_url: true,
          image_type: true,
        },
      },
      shoe_sizes: {
        select: {
          shoe_size: true,
          price: true,
          quantity: true,
        },
      },
    },
    take: LIMIT,
    skip: offset,
    orderBy,
  });

  res.status(constants.HTTP_STATUS_OK).json(shoes);
}

export async function addShoe(
  req: Request<any, any, ShoeCreateBody>,
  res: Response
) {
  let { name, condition, color, sizes, fit } = req.body;

  const { session_id }: cookies = req.cookies;
  const user_session = await user_session_handler.getSession(session_id);

  if (!user_session) {
    handleUnauthorizedRequest(res, ERROR_REASON.NOT_LOGGED_IN);
    return;
  }

  const user = (await prisma.users.findUnique({
    where: {
      user_id: user_session.user_id,
    },
  })) as users;

  if (!user.is_verified && process.env.IS_PROD === "TRUE") {
    handleUnauthorizedRequest(res, ERROR_REASON.UNVERIFIED_ACCOUNT);
    return;
  }

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  if (!files) {
    handleBadRequest(res, "No files were uploaded");
    return;
  }

  if (
    files.front &&
    files.back &&
    files.sides1 &&
    files.sides2 &&
    files.tag &&
    files.insole &&
    files.box_front &&
    files.box_tag &&
    files.box_date
  ) {
    const shoeImages: {
      image_type: shoe_images_image_type;
      image_url: string;
    }[] = [
      {
        image_type: shoe_images_image_type.Front,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.front[0].path)
        )}/${path.basename(files.front[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Back,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.back[0].path)
        )}/${path.basename(files.back[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Sides_1,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.sides1[0].path)
        )}/${path.basename(files.sides1[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Sides_2,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.sides2[0].path)
        )}/${path.basename(files.sides2[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Tag,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.tag[0].path)
        )}/${path.basename(files.tag[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Insole,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.insole[0].path)
        )}/${path.basename(files.insole[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Box_Front,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.box_front[0].path)
        )}/${path.basename(files.box_front[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Box_Tag,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.box_tag[0].path)
        )}/${path.basename(files.box_tag[0].path)}`,
      },
      {
        image_type: shoe_images_image_type.Box_date,
        image_url: `/${process.env.STATIC_URL}/${path.basename(
          path.dirname(files.box_date[0].path)
        )}/${path.basename(files.box_date[0].path)}`,
      },
    ];

    if (files.other) {
      files.other = files.other as Express.Multer.File[];
      shoeImages.push(
        ...files.other.map((image) => ({
          image_type: shoe_images_image_type.Other,
          image_url: `/${process.env.STATIC_URL}/${path.basename(
            path.dirname(image.path)
          )}/${path.basename(image.path)}`,
        }))
      );
    }

    const shoe = await prisma.shoes.create({
      data: {
        name,
        condition,
        color,
        fit,
        shoe_sizes: {
          create: sizes.map((size) => ({
            shoe_size: size.shoe_size,
            price: size.price,
            quantity: size.quantity,
          })),
        },
        users: {
          connect: {
            user_id: user_session.user_id,
          },
        },
        shoe_images: {
          create: shoeImages,
        },
      },
    });
    await res.status(constants.HTTP_STATUS_CREATED).json(shoe);
  } else {
    handleBadRequest(res, "Missing images");
  }
}
