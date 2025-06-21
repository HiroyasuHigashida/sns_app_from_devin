import { BaseService } from './BaseService';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService extends BaseService<
  { userRepository: typeof UserRepository; },
  {}
> {
  constructor (
    userRepository: typeof UserRepository,
  ) {
    super({ userRepository }, {});
  }

  async getOrSaveUser(username: string): Promise<User> {
    const user = await this.repos.userRepository.findOneBy({ username });
    if (user !== null) return user;
  
    const newUser = new User();
    newUser.username = username;

    return await this.repos.userRepository.save(newUser);
  };

  async getProfile(username: string): Promise<string> {
    // if not found, throw EntityNotFoundError
    const user = await this.repos.userRepository.findOneOrFail({
      where: { username },
    });

    return user.profile ?? '';
  }

  async updateProfile(username: string, profile: string): Promise<string> {
    // if not found, throw EntityNotFoundError
    const user = await this.repos.userRepository.findOneOrFail({
      where: { username },
    });

    user.profile = profile;
    await this.repos.userRepository.save(user);

    return profile;
  }
}
