import { Request, Response } from 'express';

import { USERS } from '../../../utils/constants';

export const GET = (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = USERS.find((e) => e.id === userId);

  if (!user) {
    res.status(404).send('User not found');
    return;
  }

  return res.status(200).json(user);
};
