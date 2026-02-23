import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('Deve chamar AuthServic.register com os dados corretos', async () => {
      const dto = { name: 'Nicholas', email: 'nicholas@email.com', password: '123456' };
      const expected = { id: 1, ...dto}

      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    })
  })

  describe('login', () => {
    it('Deve chamar AuthService.login e retornar o token', async() => {
      const dto = { email: 'nicholas@email.com', password: '123456' };
      const expected = { access_token: 'token_jwt_fake' };

      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected)
    })
  })

})