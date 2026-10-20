import { UserModel } from '../models/User.js';

class UsersDAO {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async create(userData) {
        return await UserModel.create(userData);
    }
}

export const usersDAO = new UsersDAO();