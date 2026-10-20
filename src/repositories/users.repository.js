import { usersDAO } from '../dao/users.dao.js';

class UsersRepository {
    async findByEmail(email) {
        return await usersDAO.getByEmail(email);
    }

    async createUser(userData) {
        return await usersDAO.create(userData);
    }
}

export const usersRepository = new UsersRepository();