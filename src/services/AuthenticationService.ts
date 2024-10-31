import { UserRepository } from '../repositories/UserRepository.js';
import { PasswordHasher } from '../utils/PasswordHasher.js';
import { User } from '../models/User.js';

export class AuthenticationService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByUsername(username);
        if (user && await PasswordHasher.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await PasswordHasher.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        const newPasswordHash = await PasswordHasher.hash(newPassword);
        await this.userRepository.updatePassword(userId, newPasswordHash);
    }
}
