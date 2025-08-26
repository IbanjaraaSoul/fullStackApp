import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as t from 'io-ts';

// fp-ts type definition for User
export const UserCodec = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  createdAt: t.string,
  updatedAt: t.string,
});

export type User = t.TypeOf<typeof UserCodec>;

// Create user DTO with fp-ts validation
export const CreateUserCodec = t.type({
  email: t.refinement(t.string, (s) => s.includes('@') && s.includes('.') && s.length > 5, 'Invalid email format'),
  name: t.refinement(t.string, (s) => s.length > 0 && s.length <= 100, 'Name must be between 1 and 100 characters'),
});

export type CreateUser = t.TypeOf<typeof CreateUserCodec>;

// Update user DTO (all fields optional)
export const UpdateUserCodec = t.partial({
  email: t.string,
  name: t.string,
});

export type UpdateUser = t.TypeOf<typeof UpdateUserCodec>;

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Convert entity to User type
  toUser(): User {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
