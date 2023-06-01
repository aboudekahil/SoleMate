import { NextFunction, Request, RequestHandler, Response } from "express";
import { user_session_handler } from "../config/session.config";
import { prisma } from "../config/prisma.config";
import { constants } from "http2";
import { shoe_images_image_type } from "@prisma/client";
import { MulterError } from "multer";

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
      }
      next();
    });
  };
}

export const addShoe = async (req: Request, res: Response) => {
  let { name, condition, color, sizes }: ShoeCreateBody = req.body;

  sizes = JSON.parse(sizes);

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

  const { session_id }: cookies = req.cookies;
  const user_session = await user_session_handler.getSession(session_id);

  if (!user_session) {
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      title: "Unauthorized",
      message: "You are not logged in",
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
        image_url: files.front[0].path,
      },
      {
        image_type: shoe_images_image_type.Back,
        image_url: files.back[0].path,
      },
      {
        image_type: shoe_images_image_type.Sides_1,
        image_url: files.sides1[0].path,
      },
      {
        image_type: shoe_images_image_type.Sides_2,
        image_url: files.sides2[0].path,
      },
      {
        image_type: shoe_images_image_type.Tag,
        image_url: files.tag[0].path,
      },
      {
        image_type: shoe_images_image_type.Insole,
        image_url: files.insole[0].path,
      },
      {
        image_type: shoe_images_image_type.Box_Front,
        image_url: files.box_front[0].path,
      },
      {
        image_type: shoe_images_image_type.Box_Tag,
        image_url: files.box_tag[0].path,
      },
      {
        image_type: shoe_images_image_type.Box_date,
        image_url: files.box_date[0].path,
      },
    ];

    if (files.other) {
      files.other = files.other as Express.Multer.File[];
      shoeImages.push(
        ...files.other.map((image) => ({
          image_type: shoe_images_image_type.Other,
          image_url: image.path,
        }))
      );
    }

    const shoe = await prisma.shoes.create({
      data: {
        name,
        condition,
        color,
        shoe_sizes: {
          create: (sizes as ShoeSize[]).map((size) => ({
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
};
