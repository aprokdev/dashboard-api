import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', func: this.login, method: 'post' },
			{ path: '/register', func: this.register, method: 'post' },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// res.send('Login');
		console.log('werwe');
		next(new HTTPError(401, 'Not authorized', 'login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		res.send('Register');
	}
}
