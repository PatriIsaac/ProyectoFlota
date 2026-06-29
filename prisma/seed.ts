import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcrypt';
import "dotenv/config";

async function main() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('Iniciando seed de base de datos...');

    // 1. ROLES
    const rolesData = [
        { nombre: 'Administrador', descripcion: 'Acceso total' },
        { nombre: 'Gerencia', descripcion: 'Acceso a reportes y configuración' },
        { nombre: 'Analista de Costos', descripcion: 'Módulo de costos e indicadores' },
        { nombre: 'Jefe de Mantenimiento', descripcion: 'Módulo de mantenimiento' },
        { nombre: 'Encargado de Garaje', descripcion: 'Operación diaria y abastecimiento' },
        { nombre: 'Conductor', descripcion: 'Acceso restringido' }
    ];

    const rolesMap = new Map();
    for (const r of rolesData) {
        const rol = await prisma.rol.upsert({
            where: { nombre: r.nombre },
            update: {},
            create: { nombre: r.nombre, descripcion: r.descripcion, estado: true }
        });
        rolesMap.set(r.nombre, rol.rolId);
    }
    console.log('Roles listos.');

    // 2. USUARIOS ADICIONALES
    const pass = await bcrypt.hash('123456', 10);
    const usersData = [
        { nombres: 'Admin', apellidos: 'Sistema', email: 'admin@empresa.com', rol: 'Administrador' },
        { nombres: 'Patri', apellidos: 'Isaac', email: 'patrisaacmm@gmail.com', rol: 'Administrador' },
        { nombres: 'Carlos', apellidos: 'Gerente', email: 'gerencia@empresa.com', rol: 'Gerencia' },
        { nombres: 'Ana', apellidos: 'Costos', email: 'costos@empresa.com', rol: 'Analista de Costos' },
        { nombres: 'Luis', apellidos: 'Mantenimiento', email: 'mantenimiento@empresa.com', rol: 'Jefe de Mantenimiento' },
        { nombres: 'Jorge', apellidos: 'Garaje', email: 'garaje@empresa.com', rol: 'Encargado de Garaje' },
        { nombres: 'Pedro', apellidos: 'Conductor', email: 'conductor1@empresa.com', rol: 'Conductor' },
    ];

    for (const u of usersData) {
        await prisma.usuario.upsert({
            where: { email: u.email },
            update: {},
            create: {
                nombres: u.nombres,
                apellidos: u.apellidos,
                email: u.email,
                password: pass,
                rolId: rolesMap.get(u.rol),
                estado: true
            }
        });
    }
    console.log('Usuarios de prueba listos.');

    // 3. CATEGORIAS DE VEHICULOS
    const categorias = ['Camioneta 4x4', 'Camión de Carga', 'Furgoneta', 'Automóvil Sedán'];
    const categoriasMap = new Map();
    for (let i = 0; i < categorias.length; i++) {
        const cat = await prisma.categoriaVehiculo.upsert({
            where: { codigo: `CAT-00${i+1}` },
            update: {},
            create: { codigo: `CAT-00${i+1}`, nombre: categorias[i] }
        });
        categoriasMap.set(categorias[i], cat.categoriaVehiculoId);
    }

    // 4. AREAS
    const areas = ['Operaciones', 'Ventas', 'Logística', 'Gerencia General'];
    const areasMap = new Map();
    for (const a of areas) {
        // En Prisma no pusiste unique a Area.nombre, buscaremos el primero o crearemos
        let area = await prisma.area.findFirst({ where: { nombre: a } });
        if (!area) {
            area = await prisma.area.create({ data: { nombre: a } });
        }
        areasMap.set(a, area.areaId);
    }

    // 5. TALLERES Y SERVICENTROS
    const talleres = ['Taller Central', 'Taller Autorizado Toyota', 'Mecánica Express'];
    for (let i = 0; i < talleres.length; i++) {
        await prisma.taller.upsert({
            where: { ruc: `100000000${i}` },
            update: {},
            create: { nombre: talleres[i], ruc: `100000000${i}`, direccion: 'Av. Principal ' + i, telefono: '555-000' + i, estado: true }
        });
    }

    const grifos = ['Grifo Primax', 'Grifo Repsol', 'Grifo Petroperu'];
    for (let i = 0; i < grifos.length; i++) {
        await prisma.servicentro.upsert({
            where: { ruc: `200000000${i}` },
            update: {},
            create: { nombre: grifos[i], ruc: `200000000${i}`, direccion: 'Ruta ' + i, telefono: '555-111' + i, estado: true }
        });
    }
    console.log('Catálogos base listos.');

    // 6. CONDUCTORES
    const conductoresMap = new Map();
    for (let i = 1; i <= 10; i++) {
        const doc = `400000${i.toString().padStart(2, '0')}`;
        const cond = await prisma.conductor.upsert({
            where: { documento: doc },
            update: {},
            create: { documento: doc, nombre: `Conductor Piloto ${i}`, osActivo: true }
        });
        conductoresMap.set(i, cond.conductorId);
    }

    // 7. VEHICULOS
    const vehiculosMap = new Map();
    for (let i = 1; i <= 15; i++) {
        const placa = `ABC-${i.toString().padStart(3, '0')}`;
        const catName = i <= 5 ? 'Camioneta 4x4' : i <= 10 ? 'Camión de Carga' : 'Furgoneta';
        const v = await prisma.vehiculo.upsert({
            where: { placa },
            update: {},
            create: {
                codigoPatrimonio: `PAT-2024-${i.toString().padStart(3, '0')}`,
                placa,
                categoriaVehiculoId: categoriasMap.get(catName),
                valorNuevo: 25000 + (i * 1000),
                valorResidual: 5000,
                vidaUtilAnios: 5,
                estado: 'Operativo'
            }
        });
        vehiculosMap.set(i, v.vehiculoId);
    }
    console.log('Vehículos listos.');

    // 8. ASIGNACIONES
    for (let i = 1; i <= 15; i++) {
        const vId = vehiculosMap.get(i);
        const aName = i % 2 === 0 ? 'Operaciones' : 'Logística';
        await prisma.asignacion.create({
            data: {
                vehiculoId: vId,
                areaId: areasMap.get(aName),
                fechaInicio: new Date('2023-01-01')
            }
        });
    }

    // 9. MOVIMIENTO DIARIO (muchos datos para 1 mes)
    for (let v = 1; v <= 5; v++) { // 5 vehiculos con movimientos
        let kmActual = 10000;
        for (let dia = 1; dia <= 30; dia++) {
            const kmSalida = kmActual;
            const kmLlegada = kmSalida + Math.floor(Math.random() * 150) + 50; // viaja 50 a 200 km por dia
            const horas = Math.floor(Math.random() * 8) + 2; // 2 a 10 horas
            kmActual = kmLlegada;

            await prisma.movimientoDiario.create({
                data: {
                    vehiculoId: vehiculosMap.get(v),
                    conductorId: conductoresMap.get((v % 10) + 1),
                    fecha: new Date(`2024-05-${dia.toString().padStart(2, '0')}T08:00:00Z`),
                    kmSalida,
                    kmLlegada,
                    horas,
                    destino: `Ruta de entrega ${dia}`
                }
            });
        }
    }
    console.log('Movimientos diarios listos.');

    // 10. ABASTECIMIENTO
    for (let v = 1; v <= 5; v++) {
        for (let i = 1; i <= 5; i++) { // 5 cargas por vehiculo
            await prisma.abastecimiento.upsert({
                where: { numeroOrden: `ABS-${v}-${i}` },
                update: {},
                create: {
                    numeroOrden: `ABS-${v}-${i}`,
                    vehiculoId: vehiculosMap.get(v),
                    fecha: new Date(`2024-05-${(i * 5).toString().padStart(2, '0')}T10:00:00Z`),
                    tipoCombustible: 'Diésel',
                    galones: 15 + Math.random() * 10,
                    costo: 300 + Math.random() * 50,
                    kmVelocimetro: 10000 + (i * 500)
                }
            });
        }
    }
    console.log('Abastecimientos listos.');

    // 11. TIPOS DE MANTENIMIENTO
    const tipoMantMap = new Map();
    const tiposMant = [
        { cod: 'PM-1', desc: 'Mantenimiento Preventivo Menor' },
        { cod: 'PM-2', desc: 'Mantenimiento Preventivo Mayor' },
        { cod: 'CR-1', desc: 'Mantenimiento Correctivo' }
    ];
    for (const t of tiposMant) {
        const tm = await prisma.tipoMantenimiento.upsert({
            where: { codigo: t.cod },
            update: {},
            create: { codigo: t.cod, descripcion: t.desc }
        });
        tipoMantMap.set(t.cod, tm.tipoId);
    }

    // 12. ORDENES DE SERVICIO
    for (let v = 1; v <= 3; v++) {
        await prisma.ordenServicio.upsert({
            where: { numero: `OS-2024-${v.toString().padStart(4, '0')}` },
            update: {},
            create: {
                numero: `OS-2024-${v.toString().padStart(4, '0')}`,
                vehiculoId: vehiculosMap.get(v),
                tipoId: tipoMantMap.get('PM-1'),
                taller: 'Taller Central',
                fechaEntrada: new Date('2024-05-15T08:00:00Z'),
                fechaSalida: new Date('2024-05-16T17:00:00Z'),
                kilometraje: 12500,
                DetalleCostoMantenimiento: {
                    create: [
                        { manoObra: 150, repuestos: 450, otros: 0, origen: 'Propio' }
                    ]
                }
            }
        });
    }
    console.log('Mantenimientos listos.');
    
    console.log('¡Seed completado con éxito!');
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});