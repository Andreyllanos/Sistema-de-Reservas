import api from '../api/client';
import type { Resource } from '../types';

export async function getResources(search = ''): Promise<Resource[]> {
  try {
    const response = await api.get('/resources', {
      params: { search },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ?? 'No fue posible obtener los recursos.'
    );
  }
}

export async function createResource(
  input: Omit<Resource, 'id' | 'created_at'>
): Promise<Resource> {
  try {
    const response = await api.post('/resources', input);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ?? 'No fue posible crear el recurso.'
    );
  }
}

export async function updateResource(
  id: number,
  input: Partial<Omit<Resource, 'id' | 'created_at'>>
): Promise<Resource> {
  try {
    const response = await api.put(`/resources/${id}`, input);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ?? 'No fue posible actualizar el recurso.'
    );
  }
}

export async function deleteResource(id: number): Promise<void> {
  try {
    await api.delete(`/resources/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ?? 'No fue posible eliminar el recurso.'
    );
  }
}