import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import type { AuthPayload, User, UserRole } from '../types';

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(input: { nombre: string; email: string; password: string; rol: UserRole }): Promise<{ token: string; user: User }> {
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) {
      throw new Error('El correo ya está registrado.');
    }

    const password = await bcrypt.hash(input.password, 10);
    const user = await this.userRepository.create({ ...input, password });
    const token = this.signToken({ userId: user.id, role: user.rol, email: user.email });
    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas.');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Credenciales inválidas.');
    }

    const token = this.signToken({ userId: user.id, role: user.rol, email: user.email });
    return { token, user };
  }

  async profile(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  private signToken(payload: AuthPayload): string {
    const secret = process.env.JWT_SECRET || 'cba-secret';
    return jwt.sign(payload, secret, { expiresIn: '8h' });
  }
}
