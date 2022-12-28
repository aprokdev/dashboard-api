import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { AuthGuard } from '../common/auth-guard.middleware';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middlaware';
import { IConfigService } from '../config/config.service.interface';
import { HTTPError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				func: this.login,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				func: this.register,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				func: this.info,
				method: 'get',
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.usersService.validateUser(req.body);
		if (!isValid) {
			return next(new HTTPError(401, 'Authorization error', 'login'));
		}
		const secret = this.configService.get('SECRET');
		const jwt = await this.signJWT(req.body.email, secret);
		this.ok(res, { sucess: true, jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'User already exists'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.usersService.getUserInfo(user);
		this.ok(res, { userInfo, email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
