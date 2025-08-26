import * as t from 'io-ts';

// User type definition matching backend
export const UserCodec = t.type({
  id: t.number,
  email: t.string,
  name: t.string,
  createdAt: t.string,
  updatedAt: t.string,
});

export type User = t.TypeOf<typeof UserCodec>;

// Create user DTO
export const CreateUserCodec = t.type({
  email: t.string,
  name: t.string,
});

export type CreateUser = t.TypeOf<typeof CreateUserCodec>;

// Update user DTO (all fields optional)
export const UpdateUserCodec = t.partial({
  email: t.string,
  name: t.string,
});
export type UpdateUser = t.TypeOf<typeof UpdateUserCodec>;
