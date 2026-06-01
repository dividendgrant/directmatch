import path from "node:path";
import { defineConfig } from "prisma/config";

const dbPath = path.join(process.cwd(), "dev.db");

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: `file:${dbPath}`,
  },
});
