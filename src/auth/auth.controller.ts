import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Criar nova conta' })
    @ApiBody({
        schema: {
            example: {
                name: 'Nicholas Diego',
                email: 'nicholas@email.com',
                password: '123456',
            },
        },
    })
    async register(
        @Body() dto: { name: string; email: string; password: string },
    ) {
        return this.authService.register(dto)
    }

    @Post('Login')
    @ApiOperation({ summary: 'Fazer login e obter token JWT' })
    @ApiBody({
        schema: {
            example: {
                email: 'nicholas@email.com',
                password: '123456',
            },
        },
    })
    async login(@Body() dto: { email: string; password: string }) {
        return this.authService.login(dto);
    }

}
