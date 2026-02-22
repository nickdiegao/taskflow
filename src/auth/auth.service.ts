import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly JwtService: JwtService
    ) {}

    async register(dto: {name: string; email: string; password:string }) {
        return this.usersService.create(dto);
    }

    async login(dto: { email: string; password: string }) {
        const user = await this.usersService.findByEmail(dto.email);

        if(!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.JwtService.sign(payload),
        };
    }
}
