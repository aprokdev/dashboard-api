import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error.class';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(error: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (error instanceof HTTPError) {
			this.logger.error(`[${error.context}] Error ${error.statusCode} ${error.message}`);
			res.status(error.statusCode).send({ error: error.message });
		} else {
			this.logger.error(`Error ${error.message}`);
			res.status(500).send({ error: error.message });
		}
	}
}
