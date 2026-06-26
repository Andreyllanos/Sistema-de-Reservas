import { pool } from '../config/database';
import type { User, UserRole } from '../types';

export class UserRepository {
  async create(input: { nombre: string; email: string; password: string; rol: UserRole }): Promise<User> {
    const result = await pool.query(
      `
        INSERT INTO cba_usuarios (nombre, email, password, rol)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nombre, email, password, rol, created_at
      `,
      [input.nombre, input.email.toLowerCase(), input.password, input.rol],
    );

    return result.rows[0] as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM cba_usuarios WHERE email = $1', [email.toLowerCase()]);
    return result.rows[0] as User | null;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM cba_usuarios WHERE id = $1', [id]);
    return result.rows[0] as User | null;
  }
}
