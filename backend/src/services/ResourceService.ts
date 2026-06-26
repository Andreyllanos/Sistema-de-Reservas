import { ResourceRepository } from '../repositories/ResourceRepository';
import type { Resource } from '../types';

export class ResourceService {
  constructor(private readonly resourceRepository = new ResourceRepository()) {}

  async list(search = ''): Promise<Resource[]> {
    return this.resourceRepository.list(search);
  }

  async getById(id: number): Promise<Resource | null> {
    return this.resourceRepository.findById(id);
  }

  async create(input: Omit<Resource, 'id' | 'created_at'>): Promise<Resource> {
    return this.resourceRepository.create(input);
  }

  async update(id: number, input: Partial<Omit<Resource, 'id' | 'created_at'>>): Promise<Resource | null> {
    return this.resourceRepository.update(id, input);
  }

  async delete(id: number): Promise<void> {
    return this.resourceRepository.delete(id);
  }
}
