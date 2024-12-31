import { PrismaClient as PrismaUserClient } from './user/client';
import { PrismaClient as PrismaMainClient } from './main/client';

const prismaUserDB = new PrismaUserClient();
const prismaMainDB = new PrismaMainClient();
async function main() {
  const superAdmin = await prismaUserDB.users.upsert({
    where: { email: 'test.superadmin@mailinator.com' },
    update: {},
    create: {
      email: 'test.superadmin@mailinator.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: 'test123',
      role: 'super_admin',
    },
  });
  let superAdminLog = await prismaMainDB.activities.findFirst({
    where: {
      userId: superAdmin.id,
      type: 'super_admin_created',
      description: 'Super Admin created from seeding',
      companyId: 0,
    },
  });
  if (!superAdminLog) {
    superAdminLog = await prismaMainDB.activities.create({
      data: {
        userId: superAdmin.id,
        type: 'super_admin_created',
        description: 'Super Admin created from seeding',
        companyId: 0,
      },
    });
  }
  // console.log({ superAdmin, superAdminLog });
}
main()
  .then(async () => {
    await prismaUserDB.$disconnect();
    await prismaMainDB.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaMainDB.$disconnect();
    await prismaUserDB.$disconnect();
    process.exit(1);
  });
