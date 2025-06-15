import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
  return res.status(200).send('Get users');
};

export const POST = async (req: Request, res: Response) => {
  return res.status(200).send('Post user');
};

export const DELETE = async (req: Request, res: Response) => {
  return res.status(200).send('Delete user');
};
