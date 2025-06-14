import { Request } from 'express';

import { USERS } from '../../../utils/constants';

export const GET = (req: Request) => {
  const { userId } = req.params;

  return USERS.find((e) => e.id === userId);
};
