import { Request } from 'express';

const employeesDetails = [
  {
    employeeId: '1',
    lastName: 'Sztuczka'
  }
];

export const GET = (req: Request) => {
  const { employeeId } = req.params;

  return employeesDetails.find((e) => e.employeeId === employeeId);
};
