import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma"; // ⚠️ same import to confirm as above

async function main() {
  const email = "user@gmail.com";
  const passwordHash = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log(`Seeded demo user: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });