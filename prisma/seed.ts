import { filterOptions } from "@/app/_hardcoded";
import { PrismaClient } from "@prisma/client";

const devDb = new PrismaClient();

async function main() {
  for (const filterOption of filterOptions) {
    console.log(`attempting to upsert ${filterOption.fieldId}`);
    await devDb.filterOption.upsert({
      where: { fieldId: filterOption.fieldId },
      create: filterOption,
      update: filterOption,
    });
    console.log(`✅ {filterOption.fieldId} upserted`);
  }
}

main()
  .then(async () => {
    await devDb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await devDb.$disconnect();
    process.exit(1);
  });
