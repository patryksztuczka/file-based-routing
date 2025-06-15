import { Request, Response } from 'express';

import { USERS_DETAILS } from '../../../../utils/constants';

export const GET = (req: Request, res: Response) => {
  const { userId } = req.params;

  const userDetails = USERS_DETAILS.find((e) => e.userId === userId);

  if (!userDetails) {
    return res.status(404).send('User details not found');
  }

  return res.status(200).json(userDetails);
};
