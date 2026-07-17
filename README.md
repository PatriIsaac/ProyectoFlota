# FleetSys / SAFV — Sistema de Administración de Flota Vehicular

Proyecto Integrador II. El sistema está dividido en tres repositorios independientes que juntos
forman la solución completa:

| Proyecto | Repositorio | Qué es |
| --- | --- | --- |
| **ProyectoFlota** (este repo) | [PatriIsaac/ProyectoFlota](https://github.com/PatriIsaac/ProyectoFlota) | API REST (Express + Prisma + PostgreSQL) |
| **FRONT-FLOTA** | [PatriIsaac/FRONT-FLOTA](https://github.com/PatriIsaac/FRONT-FLOTA) | Interfaz web (React + Vite) que consume la API |
| **ReportesBIRT** | [BrensNina/ReportesBIRT](https://github.com/BrensNina/ReportesBIRT) | Servicio de reportes (Eclipse BIRT) que consulta la misma base de datos |

Los tres son proyectos separados a propósito (arquitectura de microservicios aplicados a
esquemas); lo único que comparten es la base de datos PostgreSQL. Esta guía deja a cualquier
desarrollador con los tres funcionando en su máquina, en el orden en que hay que montarlos: base
de datos → API → frontend → reportes.

## 0. Requisitos previos

- **PostgreSQL** 14+ corriendo localmente (o accesible por red)
- **Node.js** 18+ y npm (para ProyectoFlota y FRONT-FLOTA)
- **JDK 21** y **Maven 3.9+** (solo para ReportesBIRT — ver su sección)
- Git

## 1. Base de datos

Crea una base vacía. Con `psql` o cualquier cliente:

```sql
CREATE DATABASE flotasys;
```

Los tres proyectos apuntan a esta misma base mediante su propia cadena de conexión — no hay
nada más que configurar a nivel de base de datos, cada proyecto crea/migra su parte.

## 2. Backend — ProyectoFlota (este repo)

### Stack

- **Node + TypeScript**, ejecutado directo con [tsx](https://github.com/privatenumber/tsx) (sin paso de build)
- **Express 5**
- **Prisma 7** + **PostgreSQL** (vía adaptador `@prisma/adapter-pg`)
- **JWT** (`jsonwebtoken`) + **bcrypt** para autenticación

### Pasos

```bash
git clone https://github.com/PatriIsaac/ProyectoFlota.git
cd ProyectoFlota
npm install
```

Crea un archivo `.env` en la raíz (no se versiona):

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/flotasys?schema=public"
JWT_SECRET="cualquier-cadena-larga-y-secreta"
PORT=3000
```

Genera el cliente Prisma (obligatorio antes de correr nada — el cliente generado vive en
`generated/prisma/` y está en `.gitignore`) y aplica las migraciones:

```bash
npx prisma generate
npx prisma migrate dev
```

Carga datos de ejemplo (vehículos, conductores, catálogos, un usuario administrador, etc.):

```bash
npm run seed
```

Ejecuta el servidor:

```bash
npm run start:dev   # con recarga en caliente
# o
npm start           # ejecución simple
```

Queda escuchando en `http://localhost:3000`.

Verificación opcional (no forma parte del arranque, pero conviene correrlo tras tocar el schema
o las rutas — `tsx` no tipa en caliente):

```bash
npx tsc --noEmit
```

### Endpoints

Todo cuelga de `/api` y requiere JWT (header `Authorization: Bearer <token>`), excepto
`/api/auth`. El recurso `usuarios` además exige rol `Administrador`.

| Recurso | Ruta base |
| --- | --- |
| Autenticación | `/api/auth` |
| Vehículos | `/api/vehiculos` |
| Conductores | `/api/conductores` |
| Movimientos diarios | `/api/movimientos` |
| Abastecimientos | `/api/abastecimientos` |
| Mantenimientos (órdenes de servicio) | `/api/mantenimientos` |
| Usuarios | `/api/usuarios` |
| Costos e indicadores (cálculo) | `/api/costos` |
| Indicadores | `/api/indicadores` |
| Áreas | `/api/areas` |
| Servicentros | `/api/servicentros` |
| Talleres | `/api/talleres` |
| Categorías de vehículo | `/api/categorias-vehiculo` |
| Tipos de mantenimiento | `/api/tipos-mantenimiento` |
| Autorizaciones de servicio externo | `/api/autorizaciones-externas` |
| Tarjetas de mano de obra | `/api/tarjetas-mano-obra` |
| Asignaciones | `/api/asignaciones` |

Usuario de prueba tras el seed: revisa `prisma/seed.ts` para el correo y contraseña exactos.

### Modelo de datos

Esquema completo en [`prisma/schema.prisma`](prisma/schema.prisma), diagrama entidad-relación
autogenerado en [`ERD.svg`](ERD.svg) (se regenera solo con `prisma generate`).

## 3. Frontend — FRONT-FLOTA

### Stack

React 19 + TypeScript + Vite + TanStack Query + react-hook-form + zod + Tailwind v4.

### Pasos

```bash
git clone https://github.com/PatriIsaac/FRONT-FLOTA.git
cd FRONT-FLOTA
npm install
```

Crea (o revisa) el `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecuta:

```bash
npm run dev
```

Vite lo levanta en `http://localhost:5173` (puerto por defecto). Inicia sesión con el usuario
que cargó el `seed` del backend. El backend debe estar corriendo antes de usar el frontend —
no hay datos mock, todo pasa por la API real.

## 4. Reportes — ReportesBIRT

Servicio aparte que genera PDFs con Eclipse BIRT contra la misma base de datos, sin necesidad de
instalar el IDE de Eclipse.

```bash
git clone https://github.com/BrensNina/ReportesBIRT.git
cd ReportesBIRT
```

### Requisitos

- **JDK 21** (ej. Eclipse Temurin: `winget install --id EclipseAdoptium.Temurin.21.JDK` en Windows)
- **Maven 3.9+** (si no lo tienes instalado como comando global, descarga el zip de
  [maven.apache.org](https://maven.apache.org/download.cgi), descomprímelo donde quieras y
  agrega su carpeta `bin` al `PATH` de la sesión antes de compilar)

### Compilar

```bash
mvn package
```

Esto descarga el motor de BIRT completo (`ch.reportingsoft.birt:birt-runtime-bundle`) y todas
las dependencias como jars sueltos en `target/lib/` — no se genera un jar sombreado (shaded) a
propósito: BIRT descubre sus propios plugins escaneando `plugin.xml` en cada jar del classpath, y
fusionarlos en un uber-jar rompe ese descubrimiento.

### Configurar la conexión a la base

Cada `.rptdesign` en `reports/` trae su propia cadena JDBC. La contraseña va como
`<encrypted-property name="odaPassword" encryptionID="base64">` — un valor en base64 (no es
cifrado real, BIRT simplemente no acepta la contraseña en texto plano ahí). El repo trae un
placeholder (`CAMBIAME` en base64) que **no** vas a poder usar tal cual; reemplázalo por la tuya:

```bash
echo -n "tu_password" | base64
```

Pega el resultado en el `<encrypted-property name="odaPassword" ...>` de
`reports/control-costo-operacional.rptdesign`. Es un cambio puramente local — no lo commitees
(si te estorba en `git status`, `git update-index --skip-worktree reports/control-costo-operacional.rptdesign`
hace que git deje de rastrear esa modificación).

También ajusta `odaURL`/`odaUser` en el mismo archivo si tu Postgres no es
`jdbc:postgresql://localhost:5432/flotasys` con usuario `postgres`.

### Generar un reporte

```bash
java -cp "target/classes;target/lib/*" com.flotasys.reportes.GenerarReporte \
  reports/control-costo-operacional.rptdesign \
  output/control-costo-operacional.pdf \
  pMesAnio=2024-05
```

(En Linux/macOS el separador del classpath es `:` en vez de `;`.)

El PDF sale en `output/`. Los parámetros del reporte se pasan como `nombre=valor` al final —
para este reporte, `pMesAnio` es el mes/año (`YYYY-MM`) que ya debe existir en
`CostoOperacionMensual` (generado desde el backend vía `POST /api/costos/calcular`).

## Orden recomendado para levantar todo desde cero

1. Crear la base `flotasys` en PostgreSQL.
2. Backend: `npm install` → `.env` → `prisma generate` → `prisma migrate dev` → `npm run seed` → `npm run start:dev`.
3. Frontend: `npm install` → `.env` → `npm run dev`. Iniciar sesión con el usuario del seed.
4. BIRT (opcional, solo si vas a generar reportes): instalar JDK 21 + Maven → `mvn package` →
   configurar la contraseña del `.rptdesign` → generar un PDF de prueba.
