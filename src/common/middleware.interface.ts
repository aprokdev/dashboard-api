import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
	execute: ({ body }: Request, res: Response, next: NextFunction) => void;
}
