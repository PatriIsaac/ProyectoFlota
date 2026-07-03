# ProyectoFlota — FleetSys API

API REST para gestión de flota vehicular: vehículos, conductores, movimientos diarios, abastecimientos, mantenimientos, costos e indicadores. Incluye autenticación con JWT.

## Stack

- **Node + TypeScript** (ejecutado con [tsx](https://github.com/privatenumber/tsx), sin build previo)
- **Express 5**
- **Prisma 7** + **PostgreSQL** (vía adaptador `@prisma/adapter-pg`)
- **JWT** (`jsonwebtoken`) y **bcrypt** para auth

## Requisitos

- Node.js 18+
- Una base de datos PostgreSQL

## Configuración

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz con tu conexión y secreto JWT:

   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/proyectoflota"
   JWT_SECRET="tu-secreto"
   PORT=3000
   ```

3. Aplica las migraciones y genera el cliente Prisma:

   ```bash
   npx prisma migrate deploy   # o `npx prisma migrate dev` en desarrollo
   npx prisma generate
   ```

4. (Opcional) Carga datos de ejemplo:

   ```bash
   npm run seed
   ```

## Ejecutar

```bash
npm run start:dev   # recarga en caliente (tsx watch)
npm start           # ejecución normal
```

El servidor queda en `http://localhost:3000`. La raíz `/` responde un healthcheck.

## Endpoints

Todas las rutas cuelgan de `/api`:

| Recurso        | Ruta base               |
| -------------- | ----------------------- |
| Autenticación  | `/api/auth`             |
| Usuarios       | `/api/usuarios`         |
| Vehículos      | `/api/vehiculos`        |
| Conductores    | `/api/conductores`      |
| Movimientos    | `/api/movimientos`      |
| Abastecimientos| `/api/abastecimientos`  |
| Mantenimientos | `/api/mantenimientos`   |
| Costos         | `/api/costos`           |
| Indicadores    | `/api/indicadores`      |

## Modelo de datos

El esquema completo está en [`prisma/schema.prisma`](prisma/schema.prisma). El diagrama entidad-relación generado está en [`ERD.svg`](ERD.svg).
