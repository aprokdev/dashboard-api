import { Request, Response, NextFunction } from 'express';
import { UserRegisterDto } from './dto/user-login.dto';
import { UserLoginDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface IUsersService {
	creatUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
