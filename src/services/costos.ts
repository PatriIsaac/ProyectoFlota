// Motor de cálculo de costos e indicadores (macroproceso MA 122 03 01).
// Funciones PURAS: no tocan la base de datos para poder probarse aisladas.
// La orquestación con Prisma vive en src/routes/costos.ts.

export interface VariablesControl {
    totalKm: number;          // VA122 01 - km recorridos en el mes
    totalHoras: number;       // VA122 02 - horas de utilización en el mes
    totalGalones: number;     // VA122 03 - galones consumidos en el mes
    costoCombustible: number; // US$ gastados en combustible en el mes
    mantPropio: number;       // VA122 04 - costo mantenimiento taller propio
    mantTerceros: number;     // VA122 05 - costo mantenimiento terceros
    kmParametro: number;      // VA122 06 - KRP, km parámetro de la categoría
    horasParametro: number;   // VA122 07 - HUP, horas parámetro de la categoría
    lubricanteCosto: number;         // línea (5b) del formulario MA 122 03 01
    llantasNuevasCosto: number;      // línea (7a)
    llantasReencauchadasCosto: number; // línea (7b)
    gastosLavado: number;            // línea (8)
    gastosViaje: number;             // línea (9)
}

export interface Indicadores {
    cvv: number;         // Costo variable del vehículo [US$/km]
    ckv: number;         // Costo por kilómetro [US$/km]  (Ec.1)
    consumo: number;     // IA122 01 [km/galón]
    pctTerceros: number; // IA122 02 [0..1]
    iuv: number;         // IA122 03 - índice de utilización [ratio] (Ec.10)
}

// IA122 03 - IUV = [(KRV/KRP) + (HUV/HUP)] / 2
export function calcularIUV(krv: number, huv: number, krp: number, hup: number): number {
    const ratioKm = krp > 0 ? krv / krp : 0;
    const ratioHoras = hup > 0 ? huv / hup : 0;
    return (ratioKm + ratioHoras) / 2;
}

export function calcularIndicadores(v: VariablesControl, cfp: number, cfv: number): Indicadores {
    const K = v.totalKm;
    // CVV = [(4b)+(5b)+(6)+(7a)+(7b)+(8)+(9)] / K, líneas del formulario MA 122 03 01.
    const costosVariables =
        v.costoCombustible +
        v.lubricanteCosto +
        v.mantPropio + v.mantTerceros +
        v.llantasNuevasCosto + v.llantasReencauchadasCosto +
        v.gastosLavado + v.gastosViaje;
    const cvv = K > 0 ? costosVariables / K : 0;
    const ckv = K > 0 ? (cfp + cfv) / K + cvv : 0;
    const consumo = v.totalGalones > 0 ? K / v.totalGalones : 0;
    const totalMant = v.mantPropio + v.mantTerceros;
    const pctTerceros = totalMant > 0 ? v.mantTerceros / totalMant : 0;
    const iuv = calcularIUV(K, v.totalHoras, v.kmParametro, v.horasParametro);
    return { cvv, ckv, consumo, pctTerceros, iuv };
}

// Depreciación lineal operacional anual (la que pide el manual para el costo).
export function depreciacionAnual(valorNuevo: number, valorResidual: number, vidaUtilAnios: number): number {
    return vidaUtilAnios > 0 ? (valorNuevo - valorResidual) / vidaUtilAnios : 0;
}

export interface FilaCpa {
    anio: number;
    valorRescate: number;       // valor de mercado estimado al final del año n
    depreciacionAcum: number;   // valorNuevo - valorRescate
    mantenimientoAcum: number;  // costo de mantenimiento acumulado hasta el año n
    costoPromedioAnual: number; // Cpa(n)
}

// Análisis de sustitución óptima (Cpa(n), Ec.11).
// Cpa(n) = [ (valorNuevo - valorRescate(n)) + Σ mantenimiento(i) ] / n
// El valor de rescate se modela con depreciación geométrica (la unidad pierde
// más valor al principio), de modo que el costo de capital por año DECRECE
// mientras el mantenimiento CRECE: la curva tiene un mínimo = edad óptima.
// factorCrecimiento y mantenimientoAnioBase son parámetros de calibración del modelo;
// con datos históricos por año se reemplaza el crecimiento estimado por valores reales.
export function curvaCostoPromedioAnual(opts: {
    valorNuevo: number;
    valorResidual: number;
    vidaUtilAnios: number;
    mantenimientoAnioBase: number;
    factorCrecimiento: number; // 0.15 = +15% de mantenimiento por año
}): { curva: FilaCpa[]; anioOptimo: number } {
    const { valorNuevo, valorResidual, vidaUtilAnios, mantenimientoAnioBase, factorCrecimiento } = opts;
    const tasaDep = valorNuevo > 0 && valorResidual > 0
        ? 1 - Math.pow(valorResidual / valorNuevo, 1 / vidaUtilAnios)
        : 1 / Math.max(vidaUtilAnios, 1);

    const curva: FilaCpa[] = [];
    let mantenimientoAcum = 0;
    for (let n = 1; n <= vidaUtilAnios; n++) {
        mantenimientoAcum += mantenimientoAnioBase * Math.pow(1 + factorCrecimiento, n - 1);
        const valorRescate = Math.max(valorNuevo * Math.pow(1 - tasaDep, n), valorResidual);
        const depreciacionAcum = valorNuevo - valorRescate;
        const costoPromedioAnual = (depreciacionAcum + mantenimientoAcum) / n;
        curva.push({ anio: n, valorRescate, depreciacionAcum, mantenimientoAcum, costoPromedioAnual });
    }
    const anioOptimo = curva.reduce((min, f) => f.costoPromedioAnual < min.costoPromedioAnual ? f : min, curva[0]).anio;
    return { curva, anioOptimo };
}

// --- Self-check (sin frameworks): tsx src/services/costos.ts ---
if (require.main === module) {
    const assert: typeof import('node:assert') = require('node:assert');
    const cerca = (a: number, b: number): void => { assert.ok(Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`); };

    const ind = calcularIndicadores({
        totalKm: 1000, totalHoras: 100, totalGalones: 50, costoCombustible: 200,
        mantPropio: 60, mantTerceros: 40, kmParametro: 2000, horasParametro: 200,
        lubricanteCosto: 20, llantasNuevasCosto: 15, llantasReencauchadasCosto: 5,
        gastosLavado: 8, gastosViaje: 12,
    }, 100, 50);
    cerca(ind.consumo, 20);              // 1000 km / 50 gal
    cerca(ind.cvv, 0.36);                // (200+20+60+40+15+5+8+12)/1000
    cerca(ind.ckv, 0.51);                // (100+50)/1000 + 0.36
    cerca(ind.pctTerceros, 0.4);         // 40/(60+40)
    cerca(ind.iuv, 0.5);                 // (1000/2000 + 100/200)/2

    // K = 0 no debe dividir por cero
    const cero = calcularIndicadores({
        totalKm: 0, totalHoras: 0, totalGalones: 0, costoCombustible: 0,
        mantPropio: 0, mantTerceros: 0, kmParametro: 100, horasParametro: 10,
        lubricanteCosto: 0, llantasNuevasCosto: 0, llantasReencauchadasCosto: 0,
        gastosLavado: 0, gastosViaje: 0,
    }, 10, 5);
    assert.ok(Number.isFinite(cero.ckv) && cero.ckv === 0);

    // La sustitución óptima debe caer en un año interior (curva en U)
    const { curva, anioOptimo } = curvaCostoPromedioAnual({
        valorNuevo: 100000, valorResidual: 10000, vidaUtilAnios: 10,
        mantenimientoAnioBase: 4000, factorCrecimiento: 0.35,
    });
    assert.ok(anioOptimo > 1 && anioOptimo < 10, `óptimo interior, fue ${anioOptimo}`);
    assert.ok(curva[anioOptimo - 1].costoPromedioAnual <= curva[0].costoPromedioAnual);
    assert.ok(curva[anioOptimo - 1].costoPromedioAnual <= curva[9].costoPromedioAnual);

    console.log('costos.ts self-check OK — año óptimo de sustitución:', anioOptimo);
}
