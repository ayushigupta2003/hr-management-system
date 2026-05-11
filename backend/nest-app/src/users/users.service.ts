import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  private users: createUserDto[] = [];

  findAll() {
    return this.users;
  }

  create(user: createUserDto): createUserDto {
    this.users.push(user);
    return user;
  }
}
