import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
  return res.status(200).send('Get book of id: ' + req.params.bookId);
};
