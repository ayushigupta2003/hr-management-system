import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  //GET all users
  @Get()
  getUsers() {
    return this.userService.findAll();
  }
  //POST create user
  @Post()
  createUser(@Body() body: createUserDto) {
    console.log(body);
    return body;
  }
}
