import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../../repositories/postgres/authentication/user.repository';
import { UserSessionRepository } from '../../repositories/postgres/authentication/user-session.repository';
import { AppError } from '../../middleware/errorHandler';
import { User } from '../../models/postgres/authentication/user.entity';

export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: UserSessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new UserSessionRepository();
  }

  async register(email: string, password: string, name?: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      email,
      name: name || email.split('@')[0],
      passwordHash,
    });

    return user;
  }

  async login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const { token, refreshToken } = await this.generateTokens(user);
    await this.createSession(user.id, refreshToken);

    return { token, refreshToken, user };
  }

  async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const session = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    await this.sessionRepository.delete(refreshToken);
    const { token, refreshToken: newRefreshToken } = await this.generateTokens(user);
    await this.createSession(user.id, newRefreshToken);

    return { token, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<{ success: boolean }> {
    await this.sessionRepository.delete(refreshToken);
    return { success: true };
  }

  async linkGmail(userId: string, oauthCode: string): Promise<{ success: boolean }> {
    // TODO: Implement Gmail OAuth flow
    // 1. Exchange oauthCode for access token and refresh token
    // 2. Store refresh token in user record
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // Placeholder - implement actual OAuth flow
    await this.userRepository.update(userId, {
      gmailRefreshToken: oauthCode, // This should be the actual refresh token
    });

    return { success: true };
  }

  private async generateTokens(user: User): Promise<{ token: string; refreshToken: string }> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError(500, 'CONFIG_ERROR', 'JWT secret not configured');
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new AppError(500, 'CONFIG_ERROR', 'JWT refresh secret not configured');
    }
    
    // Use type assertion to bypass strict type checking for expiresIn
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string | number } as SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      refreshSecret,
      { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string | number } as SignOptions
    );

    return { token, refreshToken };
  }

  private async createSession(userId: string, refreshToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.sessionRepository.create({
      userId,
      refreshToken,
      expiresAt,
    });
  }
}

