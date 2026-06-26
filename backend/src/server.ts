import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import app from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function start(): Promise<void> {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor CBA iniciado correctamente`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
}

start();