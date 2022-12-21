import { Request, Response, NextFunction, Router } from 'express';

export interface IExeptionFilter {
	catch: (error: Error, req: Request, res: Response, next: NextFunction) => void;
}
