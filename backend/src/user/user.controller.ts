import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser, User, CreateUserCodec, UpdateUserCodec } from './user.entity';
import { UserValidationPipe } from './user.validation.pipe';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new UserValidationPipe(CreateUserCodec))
  async createUser(@Body() createUserData: CreateUser): Promise<User> {
    const result = await this.userService.createUser(createUserData);
    
    if (E.isLeft(result)) {
      throw new HttpException(result.left, HttpStatus.BAD_REQUEST);
    }
    
    return result.right;
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    const result = await this.userService.getAllUsers();
    
    if (E.isLeft(result)) {
      throw new HttpException(result.left, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    return result.right;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const result = await this.userService.getUserById(id);
    
    if (O.isNone(result)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    return result.value;
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateUser>,
  ): Promise<User> {
    const result = await this.userService.updateUser(id, updateData);
    
    if (E.isLeft(result)) {
      if (result.left === 'User not found') {
        throw new HttpException(result.left, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(result.left, HttpStatus.BAD_REQUEST);
    }
    
    return result.right;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const result = await this.userService.deleteUser(id);
    
    if (E.isLeft(result)) {
      if (result.left === 'User not found') {
        throw new HttpException(result.left, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(result.left, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    return { message: 'User deleted successfully' };
  }
}
