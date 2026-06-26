import api from '../api/client';
import type { User } from '../types';
import axios from 'axios';

interface AuthResponse {
  token: string;
  user: User;
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data?.error ??
      'Error de conexión con el servidor.'
    );
  }

  throw error;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function register(
  nombre: string,
  email: string,
  password: string,
  rol: 'admin' | 'usuario'
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      nombre,
      email,
      password,
      rol,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function getProfile(): Promise<User> {
  try {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  } catch (error) {
    handleError(error);
  }
}