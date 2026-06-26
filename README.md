# CBA Sistema de Reservas

Aplicación full stack para gestionar recursos y reservas con autenticación JWT, roles, filtros y dashboard.

## Tecnologías
- Frontend: React + Vite + TypeScript
- Backend: Node + Express + TypeScript
- Base de datos: PostgreSQL en Supabase
- Autenticación: JWT
- Cliente HTTP: Axios

## Estructura

### Backend
- src/config: configuración de base de datos
- src/controllers: controladores HTTP
- src/services: lógica de negocio
- src/repositories: acceso a PostgreSQL
- src/routes: rutas de la API
- src/middlewares: autenticación y roles
- src/types: tipos compartidos

### Frontend
- src/api: cliente Axios
- src/services: consumo de la API
- src/hooks: hooks reutilizables
- src/contexts: autenticación global
- src/components: componentes de UI
- src/pages: vistas principales
- src/routes: rutas protegidas
- src/types: modelos del frontend

## Variables de entorno
Crear un archivo .env en backend con:

```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=tu_secreto
PORT=5000
```

## Instalación

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Comandos

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Flujo de autenticación
1. El usuario inicia sesión en /api/auth/login.
2. El backend valida credenciales y devuelve un JWT.
3. El frontend almacena el token y lo envía en cada petición protegida.
4. El middleware valida el JWT y carga el usuario desde PostgreSQL.

## Flujo de recursos
1. El administrador crea, edita o elimina recursos.
2. Los recursos se almacenan en la tabla cba_recursos.
3. El frontend los lista con filtros y buscador.

## Flujo de reservas
1. Un usuario crea una reserva para un recurso.
2. El backend valida que el recurso exista y que no haya conflicto de horario.
3. Se registra la reserva en cba_reservas.
4. El usuario puede editar o cancelar su reserva.

## Despliegue
- Backend: Render
- Frontend: Vercel

## Conexión a Supabase
Usa la cadena de conexión de Supabase Postgres en DATABASE_URL.
