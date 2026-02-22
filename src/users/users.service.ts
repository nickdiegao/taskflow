import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(dto: { name:string; email: string; password: string }): Promise<User> {
        throw new Error('Not implemented');
    }

    async findByEmail(email: string): Promise<User | null> {
        throw new Error('Not implemented')
    }
}
