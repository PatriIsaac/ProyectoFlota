import { Router } from 'express';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const router = Router();

const MESANIO_RE = /^\d{4}-\d{2}$/;

// GET /api/reportes/costo-operacional?mesAnio=2024-05
// Genera el PDF de "Control Mensual de Costo Operacional" (MA 122 03 01) invocando el
// servicio BIRT (ReportesBIRT, proyecto Java independiente) como proceso externo.
router.get('/costo-operacional', async (req, res) => {
    const mesAnio = String(req.query.mesAnio || '');
    if (!MESANIO_RE.test(mesAnio)) {
        return res.status(400).json({ error: 'mesAnio debe tener formato YYYY-MM' });
    }

    const birtDir = process.env.BIRT_PROJECT_DIR;
    if (!birtDir) {
        return res.status(500).json({ error: 'BIRT_PROJECT_DIR no esta configurado en el .env del backend' });
    }

    const classpath = `${path.join(birtDir, 'target', 'classes')}${path.delimiter}${path.join(birtDir, 'target', 'lib', '*')}`;
    const rptDesign = path.join(birtDir, 'reports', 'control-costo-operacional.rptdesign');
    const salida = path.join(os.tmpdir(), `costo-operacional-${mesAnio}-${Date.now()}.pdf`);

    execFile(
        'java',
        ['-cp', classpath, 'com.flotasys.reportes.GenerarReporte', rptDesign, salida, `pMesAnio=${mesAnio}`],
        { maxBuffer: 10 * 1024 * 1024 },
        (error, _stdout, stderr) => {
            if (error) {
                const detailedError = stderr || error.message;
                console.error(detailedError);
                return res.status(500).json({ error: `Error en BIRT: ${detailedError}` });
            }
            res.download(salida, `costo-operacional-${mesAnio}.pdf`, async () => {
                await fs.unlink(salida).catch(() => {});
            });
        }
    );
});

export default router;
