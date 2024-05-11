import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
  return 'Get book of id: ' + req.params.bookId;
};
