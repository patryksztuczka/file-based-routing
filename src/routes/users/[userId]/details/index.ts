import { Request } from 'express';

import { USERS_DETAILS } from '../../../../utils/constants';

export const GET = (req: Request) => {
  const { userId } = req.params;

  return USERS_DETAILS.find((e) => e.userId === userId);
};
