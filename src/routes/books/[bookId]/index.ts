import { Request } from 'express';

export const GET = async (req: Request) => {
  return 'Get book of id: ' + req.params.bookId;
};
