import AppDataSource from '@/db/AppDataSource';
import { User } from '@/db/entity/User.entity';
import { Repository } from 'typeorm';
import { hashPassword, verifyPassword } from '@/utils/password';

export class UserService {
  private get repository(): Repository<User> {
    if (!AppDataSource.isInitialized) {
      throw new Error('AppDataSource is not initialized');
    }

    return AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async createUser(userData: Omit<User, 'id' | 'password' | 'isActive'> & { password: string }): Promise<User> {
    const user = this.repository.create({
      ...userData,
      password: hashPassword(userData.password),
      isActive: true, // По умолчанию пользователь активен
    });

    return await this.repository.save(user);
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = verifyPassword(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }
}

export const userService = new UserService();