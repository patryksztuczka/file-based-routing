import { Request } from 'express';

const employees = [
  {
    id: '1',
    name: 'Patryk'
  },
  {
    id: '2',
    name: 'John'
  }
];

export const GET = (req: Request) => {
  const { employeeId } = req.params;

  return employees.find((e) => e.id === employeeId);
};
