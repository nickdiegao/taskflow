import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('Deve registrar um novo usuário', async () => {
      const dto = { name: 'Nicholas',  email: 'nicholas@email.com', password: '123456' };
      const created = { id: 1, ...dto }

      mockUsersService.create.mockResolvedValue(created);

      const result = await service.register(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created)
    });
  });

  describe('login', () => {
    it('Deve retornar um token JWT quando as credenciais forem válidas', async () => {
      const password = await bcrypt.hash('123456', 10);
      const user = { id: 1, email: 'nicholas@email.com', name: 'Nicholas', password};

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('token_jwt_fake');

      const result = await service.login({ email: user.email, password: '123456' });

      expect(result).toEqual({ access_token: 'token_jwt_fake' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email
      });
    });

    it('Deve lançar um UnauthorizedException se o usuário não existir', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'naoexiste@email.com', password: '123456' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Deve lançar UnathourizedException se a senha estiver errada', async () => {
      const password = await bcrypt.hash('senha_certa', 10);
      const user = { id: 1, email: 'nicholas@email.com', password };

      mockUsersService.findByEmail.mockResolvedValue(user);

      await expect(
        service.login({ email: 'nicholas@email.com', password: 'senha_errada' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
