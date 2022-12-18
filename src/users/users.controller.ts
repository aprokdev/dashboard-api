import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { LoggerService } from '../logger/logger.service';

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            { path: '/register', func: this.register, method: 'post' },
        ]);
    }

    login(req: Request, res: Response, next: NextFunction) {
        // res.send('Login');
        next(new HTTPError(401, 'Not authorized', 'login'));
    }

    register(req: Request, res: Response, next: NextFunction) {
        res.send('Register');
    }
}
