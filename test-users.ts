import { PrismaClient } from './generated/prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.usuario.findMany();
    console.log('Users in DB:', users.length);
    if (users.length > 0) {
        users.forEach(u => console.log(' ->', u.email));
        const admin = users.find(u => u.email === 'admin@empresa.com');
        if (admin) {
            const ok = await bcrypt.compare('123456', admin.password);
            console.log('Password 123456 matches for admin:', ok);
        } else {
            console.log('Admin not found in DB!');
        }
    }
}
main().finally(() => prisma.$disconnect());
