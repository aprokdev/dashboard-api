import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
	execute: ({ body }: Request, res: Response, next: NextFunction) => void;
}
