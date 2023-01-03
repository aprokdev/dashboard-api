import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { verify } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IMiddleware } from './middleware.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			// verifies authorization header 'Bearer ${token}'
			// if token ok, it returns email in payload in callback,
			// then AuthGuard on root level checks if request pass further or not
			verify(
				req.headers.authorization.split(' ')[1],
				this.configService.get('SECRET'),
				(err, payload) => {
					if (err) {
						console.log('err');
						next();
					} else if (payload) {
						req.user = payload.email;
						console.log('ok');
						next();
					}
				},
			);
		} else {
			next();
		}
	}
}
