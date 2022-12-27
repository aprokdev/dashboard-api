import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';

export class AuthGuard implements IMiddleware {
	async execute({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		if (user) {
			return next();
		}
		res.status(401).send({ message: 'You are not authorized' });
	}
}
