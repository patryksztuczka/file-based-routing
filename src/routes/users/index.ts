import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
  return 'Get users';
};

export const POST = async (req: Request, res: Response) => {
  return 'Post user';
};

export const PATCH = async (req: Request, res: Response) => {
  return 'Patch user';
};

export const DELETE = async (req: Request, res: Response) => {
  return 'Delete user';
};
