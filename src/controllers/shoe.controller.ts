import { NextFunction, Request, RequestHandler, Response } from "express";
import { user_session_handler } from "../config/session.config";
import { prisma } from "../config/prisma.config";
import { constants } from "http2";
import {
  shoe_fit,
  shoe_images_image_type,
  shoes_condition,
} from "@prisma/client";
import { MulterError } from "multer";
import { isEnum } from "class-validator";
import path from "path";

export async function getShoes(req: Request, res: Response) {
  console.log(process.env.SEX);
  const shoes = await prisma.shoes.findMany({
    where: {
      orders: {
        none: {},
      },
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
      users: {
        select: {
          name: true,
          family_name: true,
        },
      },
    },
  });

  res.status(constants.HTTP_STATUS_OK).json(shoes);
}

export function multerErrorHandlerMiddleware(upload: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err instanceof MulterError) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          title: "Bad request",
          message: err.message,
        });
      } else if (err) {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send(err + "Upload failed due to unknown error");
      } else {
        next();
      }
    });
  };
}

export async function addShoe(req: Request, res: Response) {
  let { name, condition, color, sizes, fit }: ShoeCreateBody = req.body;

  const { session_id }: cookies = req.cookies;
  const user_session = await user_session_handler.getSession(session_id);

  if (!user_session) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      title: "Unauthorized",
      message: "You are not logged in",
    });
    return;
  }

  if (!isEnum(condition, shoes_condition)) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Invalid condition",
    });
    return;
  }

  if (!isEnum(fit, shoe_fit)) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Invalid fit",
    });
    return;
  }

  if (!name || !color || !sizes) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Invalid input",
    });
    return;
  }

  const sizesJSON: ShoeSize[] = JSON.parse(sizes);

  if (!Array.isArray(sizesJSON)) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "Invalid sizes",
    });
    return;
  }

  for (const size of sizesJSON) {
    if (size.price <= 0 || size.quantity <= 0 || size.size <= 0) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        title: "Bad request",
        message: "Invalid sizes input",
      });
      return;
    }
  }

  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  if (!files) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad request",
      message: "No files were uploaded",
    });
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
          create: sizesJSON.map((size) => ({
            shoe_size: size.size,
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
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      title: "Bad Request",
      message: "Missing images",
    });
  }
}
