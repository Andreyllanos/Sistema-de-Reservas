import { pool } from '../config/database';
import type { Resource } from '../types';

export class ResourceRepository {
  async list(search = ''): Promise<Resource[]> {
    const result = await pool.query(
      `SELECT * FROM cba_recursos WHERE LOWER(nombre) LIKE $1 ORDER BY id DESC`,
      [`%${search.toLowerCase()}%`],
    );
    return result.rows as Resource[];
  }

  async findById(id: number): Promise<Resource | null> {
    const result = await pool.query('SELECT * FROM cba_recursos WHERE id = $1', [id]);
    return result.rows[0] as Resource | null;
  }

  async create(input: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> {
    const result = await pool.query(
      `
        INSERT INTO cba_recursos (nombre, descripcion, tipo, estado)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nombre, descripcion, tipo, estado, created_at
      `,
      [input.nombre, input.descripcion, input.tipo, input.estado],
    );
    return result.rows[0] as Resource;
  }

  async update(id: number, input: Partial<Omit<Resource, 'id' | 'created_at'>>): Promise<Resource | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(input)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index += 1;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE cba_recursos SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, nombre, descripcion, tipo, estado, created_at`,
      values,
    );
    return result.rows[0] as Resource | null;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM cba_recursos WHERE id = $1', [id]);
  }
}
