import { User } from './model/user';

let users: User[] = [];

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (userId: string): User | undefined => {
  return users.find((user) => user.id === userId);
};

export const createUser = (user: User): User => {
  users.push(user);
  return user;
};

export const updateUser = (userId: string, updatedUser: User): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    return users[userIndex];
  }
  return undefined;
};

export const deleteUser = (userId: string): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)[0];
    return deletedUser;
  }
  return undefined;
};