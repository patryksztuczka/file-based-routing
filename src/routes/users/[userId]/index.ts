import { Request } from 'express';

const users = [
  {
    id: '5',
    name: 'Patryk'
  },
  {
    id: '6',
    name: 'John'
  }
];

export const GET = (req: Request) => {
  const { userId } = req.query;

  return users.find((e) => e.id === userId);
};
