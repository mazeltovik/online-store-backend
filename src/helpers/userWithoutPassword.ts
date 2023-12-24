import { User } from '@prisma/client';

export function userWithoutPassword(user: User) {
  const { id, login, version, createdAt, updatedAt } = user;
  return {
    id,
    login,
    version,
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  };
}
