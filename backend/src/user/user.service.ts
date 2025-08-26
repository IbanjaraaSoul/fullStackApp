import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { UserEntity, User, CreateUser, UserCodec, CreateUserCodec } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Create a new user with fp-ts error handling
  async createUser(createUserData: CreateUser): Promise<E.Either<string, User>> {
    try {
      // Validate input with fp-ts
      const validationResult = CreateUserCodec.decode(createUserData);
      
      if (E.isLeft(validationResult)) {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }

      const user = this.userRepository.create(validationResult.right);
      const savedUser = await this.userRepository.save(user);
      
      return E.right(savedUser.toUser());
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        return E.left('User with this email already exists');
      }
      return E.left(`Failed to create user: ${error.message}`);
    }
  }

  // Get all users with fp-ts error handling
  async getAllUsers(): Promise<E.Either<string, User[]>> {
    try {
      const users = await this.userRepository.find();
      const validatedUsers = users.map(user => user.toUser());
      
      // Validate all users with fp-ts
      const validationResult = t.array(UserCodec).decode(validatedUsers);
      
      if (E.isLeft(validationResult)) {
        return E.left(`Invalid user data: ${JSON.stringify(validationResult.left)}`);
      }
      
      return E.right(validationResult.right);
    } catch (error) {
      return E.left(`Failed to fetch users: ${error.message}`);
    }
  }

  // Get user by ID with fp-ts Option type
  async getUserById(id: number): Promise<O.Option<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user ? O.some(user.toUser()) : O.none;
    } catch (error) {
      return O.none;
    }
  }

  // Get user by email with fp-ts Option type
  async getUserByEmail(email: string): Promise<O.Option<User>> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user ? O.some(user.toUser()) : O.none;
    } catch (error) {
      return O.none;
    }
  }

  // Update user with fp-ts error handling
  async updateUser(id: number, updateData: Partial<CreateUser>): Promise<E.Either<string, User>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        return E.left('User not found');
      }

      // Validate update data - create a partial codec manually
      const partialCodec = t.partial({
        email: t.string,
        name: t.string
      });
      const validationResult = partialCodec.decode(updateData);
      
      if (E.isLeft(validationResult)) {
        return E.left(`Invalid update data: ${JSON.stringify(validationResult.left)}`);
      }

      Object.assign(user, validationResult.right);
      const updatedUser = await this.userRepository.save(user);
      
      return E.right(updatedUser.toUser());
    } catch (error) {
      return E.left(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user with fp-ts error handling
  async deleteUser(id: number): Promise<E.Either<string, boolean>> {
    try {
      const result = await this.userRepository.delete(id);
      
      if (result.affected === 0) {
        return E.left('User not found');
      }
      
      return E.right(true);
    } catch (error) {
      return E.left(`Failed to delete user: ${error.message}`);
    }
  }
}
