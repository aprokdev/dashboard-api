import { ILogger } from '../logger/logger.interface';
import { Request, Response, NextFunction, Router } from 'express';

export interface IUsersController {
	// router: Router;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
