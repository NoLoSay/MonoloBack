import { PrismaClient as PrismaBaseClient } from "@prisma/client/base";

declare global {
  // eslint-disable-next-line no-var
  var prismaBase: PrismaBaseClient | undefined;
}

export const db = globalThis.prismaBase || new PrismaBaseClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaBase = db;
