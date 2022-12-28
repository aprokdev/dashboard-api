import { UserModel } from '@prisma/client';
import { hash } from 'bcryptjs';
import { Container } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.IUsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.IUsersRepository).toConstantValue(UsersRepositoryMock);

	usersService = container.get<IUsersService>(TYPES.IUsersService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.IUsersRepository);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@bk.ru',
			name: 'Anton',
			password: '123',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123');
	});

	it('validateUser: right password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({ email: 'a@bk.ru', password: '123' });
		expect(result).toBeTruthy();
	});

	it('validateUser: wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await usersService.validateUser({ email: 'a@bk.ru', password: '12' });
		expect(result).toBeFalsy();
	});

	it('validateUser: wrong email', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await usersService.validateUser({ email: 'a@bk.ru', password: '12' });
		expect(result).toBeFalsy();
	});
});
