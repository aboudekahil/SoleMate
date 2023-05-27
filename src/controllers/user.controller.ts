import { Request, Response } from "express";

export const SignUp = async (req: Request, res: Response) => {
  const {
    FullName,
    Email,
    Password,
    Country,
    DOB,
    Avatar,
    isArtist,
    StageName,
  } = req.body;
};
